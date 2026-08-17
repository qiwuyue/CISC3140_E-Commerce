import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    categoryId: z.uuid(),
    brandId: z.uuid(),

    sku: z.string().trim().min(1),

    price: z.coerce
        .number()
        .positive("Price must be greater than 0"),

    quantity: z.coerce
        .number()
        .int()
        .min(0),

    isActive: z.boolean().default(true),
});
export const updateProductSchema =
  createProductSchema.partial();

export type CreateProductInput =
    z.infer<typeof createProductSchema>;