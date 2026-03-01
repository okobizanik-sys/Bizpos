import { z } from "zod";

export const billFormSchema = z.object({
  phone: z
    .string()
    // .length(11, {message: "Phone number must be 11 digits!"})
    .refine(
      (v) => {
        let n = Number(v);
        return !isNaN(n) && v?.length === 11;
      },
      { message: "Invalid Number (Must have 11 digits)" }
    ),
  name: z.string().max(255).optional(),
  address: z.string().max(2000).optional(),
});
