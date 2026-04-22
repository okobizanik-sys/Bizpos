"use server";

import { filenameGenerator } from "@/utils/helpers";
import { processImage, saveImageBufferToFile } from "@/lib/sharp";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import db from "@/db/database";

export async function createProductFormAction(formData: FormData) {
  try {
    const createdProduct = await db.transaction(async (trx) => {
      let brandId: number | null = null;
      if (formData.get("brandId") === "") {
        brandId = null;
      } else {
        brandId = Number(formData.get("brandId"));
      }
      const data = {
        files: formData.getAll("files") as File[],
        name: formData.get("name"),
        sellingPrice: Number(formData.get("sellingPrice")),
        categoryId: Number(formData.get("categoryId")),
        brandId: brandId,
        colorIds: formData.getAll("colorIds"),
        sizeIds: formData.getAll("sizeIds"),
        sku: formData.get("sku") as string,
        description: formData.get("description") as string,
      };

      let imageId: number | null = null;

      if (data.files.length > 0) {
        try {
          const processedFile = await processImage(data.files[0], 400, 400);
          const filename = filenameGenerator(
            data.files[0].name,
            "product",
            "/images/products",
          );
          await saveImageBufferToFile(processedFile, filename);
          logger.info(`File uploaded successfully: ${filename}`);

          const [insertImageResult] = await trx("images").insert({
            url: filename,
          });
          const lastInsertImageId = insertImageResult;

          const [image] = await trx("images").where({ id: lastInsertImageId });
          imageId = image.id;
          logger.info(`Image created successfully: ${imageId}`);
        } catch (imageError) {
          throw new Error("Image upload failed");
        }
      }

      const [insertProductResult] = await trx("products").insert({
        name: data.name,
        sku: data.sku,
        barcode: null,
        barcode_serial_id: null,
        selling_price: data.sellingPrice,
        description: data.description,
        category_id: data.categoryId,
        brand_id: data.brandId,
        image_id: imageId,
      });
      const lastInsertProductId = insertProductResult;

      const [product] = await trx("products").where({
        id: lastInsertProductId,
      });

      logger.info(`Product created successfully: ${product.id}`);

      if (data.colorIds.length > 0) {
        await trx("products_colors").insert(
          data.colorIds.map((colorId) => ({
            product_id: product.id,
            color_id: Number(colorId),
          })),
        );
        logger.info(
          `Product colors linked successfully for product: ${product.id}`,
        );
      }

      if (data.sizeIds.length > 0) {
        await trx("products_sizes").insert(
          data.sizeIds.map((sizeId) => ({
            product_id: product.id,
            size_id: Number(sizeId),
          })),
        );
        logger.info(
          `Product sizes linked successfully for product: ${product.id}`,
        );
      }

      revalidatePath("/inventories/products");
      revalidatePath("/inventories/variants");
      return product;
    });
    return {
      success: true,
      message: "product creation successful",
    };
  } catch (error) {
    logger.error("Error creating product:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create product");
  }
}
