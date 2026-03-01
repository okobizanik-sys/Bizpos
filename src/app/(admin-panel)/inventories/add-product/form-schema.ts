import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  sku: z.string().min(1, "SKU is required").max(100),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string(),
  sellingPrice: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: "Invalid number" }
  ),
  description: z.string().max(2000).optional(),
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(1, {
      message: "Maximum 1 files are allowed",
    })
    .optional()
    .default([]),
  colorIds: z.array(z.string()).optional().default([]),
  sizeIds: z.array(z.string()).optional().default([]),
});

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
};
