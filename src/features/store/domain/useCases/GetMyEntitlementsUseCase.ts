import type { StoreRepository } from "../repositories/StoreRepository";

export class GetMyEntitlementsUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute() {
    return this.storeRepository.getMyEntitlements();
  }
}
