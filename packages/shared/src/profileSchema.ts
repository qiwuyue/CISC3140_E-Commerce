import * as z from "zod";

export const profileSchema = z
  .strictObject({
    firstName: z.string().trim().max(50, "First name is too long"),

    lastName: z.string().trim().max(50, "Last name is too long"),

    phone: z
      .string()
      .trim()
      .max(10, "Phone number is too long")
      .refine(
        (value) =>
          value === "" ||
          /^[0-9+().\-\s]+$/.test(value),
        {
          message: "Invalid phone number",
        }
      ),

    addressLine1: z
      .string()
      .trim()
      .max(100, "Address is too long"),

    addressLine2: z
      .string()
      .trim()
      .max(100, "Address is too long"),

    city: z
      .string()
      .trim()
      .max(100, "City is too long"),

    state: z
      .string()
      .trim()
      .max(100, "State is too long"),

    postalCode: z
      .string()
      .trim()
      .max(20, "Postal code is too long"),

    country: z
      .string()
      .trim()
      .length(2, "Country must be a 2-letter code")
      .toUpperCase(),
  })

  .superRefine((data, ctx) => {
    if (
      data.country === "US" &&
      data.postalCode !== "" &&
      !/^\d{5}(-\d{4})?$/.test(data.postalCode)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["postalCode"],
        message: "Invalid US ZIP code",
      });
    }
  });

export type ProfileInput = z.infer<typeof profileSchema>;