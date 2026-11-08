/**
 * Store (buy/sell) domain repository interface.
 *
 * NOTE ON ASSUMPTIONS: the backend documentation (DOCUMENTATION.md) describes the
 * payment/order/product/PDF routes but does not publish exact response shapes for
 * every endpoint. The response parsers in StoreRepositoryImpl are intentionally
 * defensive (array / `data` / `product` / `url` keys) so the frontend keeps working
 * while the exact shapes are confirmed against the running server.
 *
 * Assumed endpoints (verify against the backend):
 *   GET    /entitlements      -> my purchased entitlements (library)
 *   GET    /products          -> { products, page, limit, total } (tolerant to arrays)
 *   GET    /products/:id      -> { product } (tolerant to direct object)
 *   GET    /products/:id/pdf/download -> { url } (tolerant to downloadUrl/signedUrl/string)
 */

export type ProductType = "PDF" | "COURSE";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ProductType;
  status: ProductStatus;
  priceMinor: number; // minor units (paisa); NPR 10.00 = 1000
  currency: string;
  coverKey?: string | null;
  createdAt: string;
  updatedAt: string;
  asset?: {
    storageKey: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  } | null;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  amountMinor: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  idempotencyKey: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KhaltiInitiation {
  orderId: string;
  paymentId: string;
  pidx: string;
  paymentUrl: string;
}

export interface PaymentVerifyResult {
  verified: boolean;
  status: string;
  orderId: string;
}

export interface Entitlement {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  grantedAt: string;
  revokedAt: string | null;
  product?: Product | null;
}
export type CreatedOrder = Pick<Order, "id">;

export interface StoreRepository {
  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    products: Product[];
    page: number;
    limit: number;
    total: number;
  }>;

  getProductById(id: string): Promise<Product>;

createOrder(input: {
  productId: string;
  idempotencyKey: string;
}): Promise<CreatedOrder>;

  initiateKhaltiPayment(orderId: string): Promise<KhaltiInitiation>;

  verifyKhaltiPayment(pidx: string): Promise<PaymentVerifyResult>;

  getMyEntitlements(): Promise<Entitlement[]>;

  createProduct(input: {
    title: string;
    slug: string;
    description?: string;
    type: ProductType;
    priceMinor: number;
    currency?: string;
  }): Promise<Product>;

  uploadProductPdf(productId: string, file: {
    uri: string;
    name: string;
    type: string;
  }): Promise<void>;

  getProductPdfDownloadUrl(productId: string): Promise<string>;
}
