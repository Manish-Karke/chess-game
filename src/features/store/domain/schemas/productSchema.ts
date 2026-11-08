import z from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase letters, numbers and hyphens only",
    }),
  description: z.string().max(2000, "Description is too long").optional(),
  type: z.enum(["PDF", "COURSE"]),
  priceMinor: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+$/, "Enter a valid price"),
  currency: z.string().min(1).max(3),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
