import { apiRequest } from "@/shared/api/apiClient";
import type {
    CreatedOrder,
  Entitlement,
  KhaltiInitiation,
  Order,
  PaymentVerifyResult,
  Product,
} from "../../domain/repositories/StoreRepository";

function normalizeData(body: unknown): unknown {
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(obj, "data") && obj.data !== undefined) {
      return obj.data;
    }
  }
  return body;
}

function queryString(params?: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        search.append(key, String(value));
      }
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/* ------------------------------------------------------------------ */
/* Defensive response parsers                                         */
/* The backend docs describe the routes but not every response shape. */
/* ------------------------------------------------------------------ */

function parseProductList(
  body: unknown,
): { products: Product[]; page: number; limit: number; total: number } {
  let items: unknown[] = [];
  let page = 1;
  let limit = 20;
  let total = 0;

  if (Array.isArray(body)) {
    items = body as unknown[];
  } else if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    items =
      Array.isArray(obj.products) || Array.isArray(obj.data)
        ? Array.isArray(obj.products)
          ? (obj.products as unknown[])
          : (obj.data as unknown[])
        : [];
    page = typeof obj.page === "number" ? obj.page : 1;
    limit = typeof obj.limit === "number" ? obj.limit : 20;
    total = typeof obj.total === "number" ? obj.total : items.length;
  }

  return {
    products: items as Product[],
    page,
    limit,
    total: typeof total === "number" ? total : items.length,
  };
}

function parseProduct(body: unknown): Product {
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    const candidate =
      obj.product ?? obj.data ?? obj;
    if (candidate && typeof candidate === "object" && "id" in candidate) {
      return candidate as Product;
    }
  }
  throw new Error("Unexpected product response from server.");
}

function parseDownloadUrl(body: unknown): string {
  if (typeof body === "string") {
    return body;
  }
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    for (const key of ["url", "downloadUrl", "signedUrl", "uri"]) {
      if (typeof obj[key] === "string") {
        return obj[key];
      }
    }
  }
  throw new Error("Unexpected download response from server.");
}

function parseEntitlements(body: unknown): Entitlement[] {
  if (Array.isArray(body)) {
    return body as Entitlement[];
  }
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.entitlements)) return obj.entitlements as Entitlement[];
    if (Array.isArray(obj.data)) return obj.data as Entitlement[];
  }
  return [];
}

/* ------------------------------------------------------------------ */
/* Endpoints                                                          */
/* ------------------------------------------------------------------ */

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const body = await apiRequest<unknown>(
    `/products${queryString(params)}`,
    { auth: false },
  );
  return parseProductList(body);
}

export async function getProductById(id: string) {
  const body = await apiRequest<unknown>(
    `/products/${encodeURIComponent(id)}`,
    { auth: false },
  );
  return parseProduct(body);
}


export async function createOrder(input: {
  productId: string;
  idempotencyKey: string;
}): Promise<CreatedOrder> {
  const response = await apiRequest<unknown>("/orders", {
    method: "POST",
    body: input,
  });

  const payload = normalizeData(response);

  if (
    payload === null ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    throw new Error("Invalid order creation response.");
  }

  const data = payload as Record<string, unknown>;

  // Backend returns orderId; domain contract uses id.
  const id = data.orderId ?? data.id;

  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Order response is missing its ID.");
  }

  return { id };
}


export async function initiateKhaltiPayment(orderId: string) {
  const body = await apiRequest<unknown>("/payments/khalti/initiate", {
    method: "POST",
    body: { orderId },
  });
  return normalizeData(body) as KhaltiInitiation;
}

export async function verifyKhaltiPayment(pidx: string) {
  const body = await apiRequest<unknown>("/payments/khalti/verify", {
    method: "POST",
    body: { pidx },
  });
  return normalizeData(body) as PaymentVerifyResult;
}

export async function getMyEntitlements() {
  const body = await apiRequest<unknown>("/entitlements", { auth: true });
  return parseEntitlements(body);
}

export async function createProduct(input: {
  title: string;
  slug: string;
  description?: string;
  type: "PDF" | "COURSE";
  priceMinor: number;
  currency?: string;
}) {
  const body = await apiRequest<unknown>("/products", {
    method: "POST",
    body: input,
  });
  return parseProduct(normalizeData(body));
}

export async function uploadProductPdf(productId: string, file: {
  uri: string;
  name: string;
  type: string;
}) {
  const formData = new FormData();
  formData.append("pdf", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);

  // No Content-Type header: fetch sets the multipart boundary automatically.
  const body = await apiRequest<unknown>(
    `/products/${encodeURIComponent(productId)}/pdf`,
    {
      method: "POST",
      body: formData,
      headers: {},
    },
  );

  // The route returns nothing meaningful beyond an HTTP 200.
  return normalizeData(body) as void;
}


export async function getProductPdfDownloadUrl(
  productId: string,
): Promise<string> {
  const body = await apiRequest<unknown>(
    `/products/${encodeURIComponent(productId)}/pdf/download`,
  );

  return parseDownloadUrl(normalizeData(body));
}

