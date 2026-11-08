import type { StoreRepository } from "../repositories/StoreRepository";

export class GetProductByIdUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(id: string) {
    return this.storeRepository.getProductById(id);
  }
}
