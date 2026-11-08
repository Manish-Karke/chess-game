import type { StoreRepository } from "../repositories/StoreRepository";

export class UploadProductPdfUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(productId: string, file: {
    uri: string;
    name: string;
    type: string;
  }) {
    return this.storeRepository.uploadProductPdf(productId, file);
  }
}
