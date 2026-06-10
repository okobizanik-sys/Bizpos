import { z } from "zod";

export const settingsFormSchema = z.object({
  return_privacy_policy: z.string().optional(),
  vat_rate: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), {
      message: "VAT rate must be a valid number",
    }),
  brand_name: z.string().optional(),
  logo_image: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .max(1, {
      message: "Maximum 1 file is allowed",
    }),
  login_image: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .max(1, {
      message: "Maximum 1 file is allowed",
    }),
});

export const paymentMethodsFormSchema = z.object({
  name: z.string(),
});

export type SettingsFormSchema = z.infer<typeof settingsFormSchema>;

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
};
