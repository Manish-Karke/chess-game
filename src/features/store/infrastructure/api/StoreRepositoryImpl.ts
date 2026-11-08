import type {
    CreatedOrder,
  Entitlement,
  KhaltiInitiation,
  Order,
  PaymentVerifyResult,
  Product,
  StoreRepository,
} from "../../domain/repositories/StoreRepository";
import {
  createOrder,
  createProduct,
  getMyEntitlements,
  getProductById,
  getProductPdfDownloadUrl,
  getProducts,
  initiateKhaltiPayment,
  uploadProductPdf,
  verifyKhaltiPayment,
} from "./storeApi";

export class StoreRepositoryImpl implements StoreRepository {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    products: Product[];
    page: number;
    limit: number;
    total: number;
  }> {
    return getProducts(params);
  }

  async getProductById(id: string): Promise<Product> {
    return getProductById(id);
  }
async createOrder(input: {
  productId: string;
  idempotencyKey: string;
}): Promise<CreatedOrder> {
    return createOrder(input);
  }

  async initiateKhaltiPayment(orderId: string): Promise<KhaltiInitiation> {
    return initiateKhaltiPayment(orderId);
  }

  async verifyKhaltiPayment(pidx: string): Promise<PaymentVerifyResult> {
    return verifyKhaltiPayment(pidx);
  }

  async getMyEntitlements(): Promise<Entitlement[]> {
    return getMyEntitlements();
  }

  async createProduct(input: {
    title: string;
    slug: string;
    description?: string;
    type: "PDF" | "COURSE";
    priceMinor: number;
    currency?: string;
  }): Promise<Product> {
    return createProduct(input);
  }

  async uploadProductPdf(
    productId: string,
    file: { uri: string; name: string; type: string },
  ): Promise<void> {
    await uploadProductPdf(productId, file);
  }

  async getProductPdfDownloadUrl(productId: string): Promise<string> {
    return getProductPdfDownloadUrl(productId);
  }
}
