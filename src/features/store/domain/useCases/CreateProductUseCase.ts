import type { StoreRepository } from "../repositories/StoreRepository";

export class CreateProductUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(input: {
    title: string;
    slug: string;
    description?: string;
    type: "PDF" | "COURSE";
    priceMinor: number;
    currency?: string;
  }) {
    return this.storeRepository.createProduct(input);
  }
}
