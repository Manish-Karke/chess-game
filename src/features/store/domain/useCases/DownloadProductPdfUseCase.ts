import type { StoreRepository } from "../repositories/StoreRepository";

export class DownloadProductPdfUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(productId: string) {
    // Returns a Supabase signed URL (valid 120 seconds on the server).
    return this.storeRepository.getProductPdfDownloadUrl(productId);
  }
}
