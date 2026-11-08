import { useCallback, useEffect, useState } from "react";
import type { Product } from "../../domain/repositories/StoreRepository";
import { getProductByIdUseCase } from "../../di/storeFactory";

export function useProductViewModel({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getProductByIdUseCase.execute(productId);
      setProduct(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load the product. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  return { product, loading, error, refresh: load };
}
