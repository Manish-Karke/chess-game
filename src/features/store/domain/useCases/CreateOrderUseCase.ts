import type {
    CreatedOrder,
    StoreRepository,
} from "../repositories/StoreRepository";

function generateIdempotencyKey(): string {
    return `order-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class CreateOrderUseCase {
    constructor(private readonly storeRepository: StoreRepository) {}

    async execute(input: {
        productId: string;
        idempotencyKey?: string;
    }): Promise<CreatedOrder> {
        return this.storeRepository.createOrder({
            productId: input.productId,
            idempotencyKey: input.idempotencyKey ?? generateIdempotencyKey(),
        });
    }
}
