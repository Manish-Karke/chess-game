import type { StoreRepository } from "../repositories/StoreRepository";

export class GetProductsUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return this.storeRepository.getProducts(params);
  }
}
