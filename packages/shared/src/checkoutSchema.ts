import * as z from "zod";

export const checkoutSchema = z
  .strictObject({
    shippingName: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name is too long"),

    shippingAddress1: z
      .string()
      .trim()
      .min(1, "Address is required")
      .max(100, "Address is too long"),

    shippingAddress2: z
      .string()
      .trim()
      .max(100, "Address is too long"),

    shippingCity: z
      .string()
      .trim()
      .min(1, "City is required")
      .max(100),

    shippingState: z
      .string()
      .trim()
      .min(1, "State is required")
      .max(100),

    shippingPostalCode: z
      .string()
      .trim()
      .min(1, "Postal code is required")
      .max(20),

    shippingCountry: z
      .string()
      .trim()
      .length(2)
      .toUpperCase(),

    shippingPhone: z
      .string()
      .trim()
      .max(20),
  })
  .superRefine((data, ctx) => {
    if (
      data.shippingCountry === "US" &&
      !/^\d{5}(-\d{4})?$/.test(data.shippingPostalCode)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["shippingPostalCode"],
        message: "Invalid US ZIP code",
      });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;