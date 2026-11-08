
import { useCallback, useRef, useState } from "react";
import { openBrowserAsync, warmUpAsync } from "expo-web-browser";

import {
  createOrderUseCase,
  initiateKhaltiPaymentUseCase,
  verifyKhaltiPaymentUseCase,
} from "../../di/storeFactory";

type BuyStatus =
  | "idle"
  | "creating-order"
  | "initiating-payment"
  | "waiting-for-payment"
  | "verifying"
  | "success"
  | "failure";

const generateIdempotencyKey = () =>
  `order-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export function useBuyViewModel({
  productId,
}: {
  productId: string;
}) {
  const [status, setStatus] = useState<BuyStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pidx, setPidx] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const [idempotencyKey, setIdempotencyKey] =
    useState<string>(generateIdempotencyKey);

  const purchaseInFlight = useRef(false);
  const verificationInFlight = useRef(false);

  const startPurchase = useCallback(async () => {
    if (purchaseInFlight.current) return;

    if (!productId) {
      setError("Product ID is missing.");
      setStatus("failure");
      return;
    }

    purchaseInFlight.current = true;
    setError(null);

    try {
      let currentOrderId = orderId;

      // Reuse an existing order when retrying.
      if (!currentOrderId) {
        setStatus("creating-order");

        const order = await createOrderUseCase.execute({
          productId,
          idempotencyKey,
        });

        if (!order.id) {
          throw new Error("Invalid order ID returned by server.");
        }

        currentOrderId = order.id;
        setOrderId(currentOrderId);
      }

      // Start a new payment attempt for this order.
      setPidx(null);
      setPaymentUrl(null);
      setStatus("initiating-payment");

      const initiation =
        await initiateKhaltiPaymentUseCase.execute(currentOrderId);

      if (!initiation.pidx || !initiation.paymentUrl) {
        throw new Error("Invalid Khalti initiation response.");
      }

      setPidx(initiation.pidx);
      setPaymentUrl(initiation.paymentUrl);
      setStatus("waiting-for-payment");
    } catch (err) {
      setStatus("failure");
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start your purchase.",
      );
    } finally {
      purchaseInFlight.current = false;
    }
  }, [productId, orderId, idempotencyKey]);

  const openPaymentPage = useCallback(async () => {
    if (!paymentUrl) {
      setError("Khalti payment URL is unavailable.");
      return;
    }

    setError(null);

    try {
      await warmUpAsync();
      await openBrowserAsync(paymentUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to open Khalti checkout.",
      );
    }
  }, [paymentUrl]);

  const verifyPayment = useCallback(async () => {
    if (!pidx || verificationInFlight.current) return;

    verificationInFlight.current = true;
    setStatus("verifying");
    setError(null);

    try {
      const result = await verifyKhaltiPaymentUseCase.execute(pidx);

      if (result.verified) {
        setStatus("success");
        return;
      }

      const paymentStatus = result.status.toUpperCase();

      if (
        ["PENDING", "INITIATED", "PROCESSING", "CREATED"].includes(
          paymentStatus,
        )
      ) {
        setStatus("waiting-for-payment");
        setError("Payment is still pending. Please try again.");
        return;
      }

      setStatus("failure");
      setError("Payment was not completed successfully.");
    } catch (err) {
      // Keep the payment reference so verification can be retried.
      setStatus("waiting-for-payment");
      setError(
        err instanceof Error
          ? `Could not confirm payment: ${err.message}`
          : "Could not confirm payment. Please retry.",
      );
    } finally {
      verificationInFlight.current = false;
    }
  }, [pidx]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setOrderId(null);
    setPidx(null);
    setPaymentUrl(null);
    setIdempotencyKey(generateIdempotencyKey());
  }, []);

  return {
    status,
    error,
    orderId,
    pidx,
    paymentUrl,
    startPurchase,
    openPaymentPage,
    verifyPayment,
    reset,
    isPaid: status === "success",
  };
}
