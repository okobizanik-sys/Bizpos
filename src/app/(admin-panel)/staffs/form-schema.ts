import { z } from "zod";

export const stafFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255)
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required").max(255),
  branchId: z.string().min(1, "Branch is required").max(255),
  name: z.string().max(2000).optional(),
  phone: z.string().max(11, "Phone number must be 11 digits").optional(),
  designation: z.string().max(2000).optional(),
});
