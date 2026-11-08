import type { StoreRepository } from "../repositories/StoreRepository";

export class InitiateKhaltiPaymentUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(orderId: string) {
    return this.storeRepository.initiateKhaltiPayment(orderId);
  }
}
