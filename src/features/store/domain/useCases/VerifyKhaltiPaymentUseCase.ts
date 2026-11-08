import type { StoreRepository } from "../repositories/StoreRepository";

export class VerifyKhaltiPaymentUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(pidx: string) {
    // Server-side verification: the client-reported status is never trusted.
    return this.storeRepository.verifyKhaltiPayment(pidx);
  }
}
