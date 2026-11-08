import z from "zod";

export const createOrderSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  idempotencyKey: z.string().min(1, "Idempotency key is required"),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
