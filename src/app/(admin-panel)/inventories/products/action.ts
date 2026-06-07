"use server";

import { createImage } from "@/services/image";
import { deleteProduct, updateProduct } from "@/services/product";
import { filenameGenerator } from "@/utils/helpers";
import { processImage, saveImageBufferToFile } from "@/lib/sharp";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import { Images } from "@/types/shared";
import prisma from "@/db/prisma";

export async function updateProductFormAction(id: number, formData: FormData) {
  await prisma.$transaction(async (tx) => {
    const data = {
      files: formData.getAll("files") as File[],
      name: formData.get("name") as string,
      sellingPrice: Number(formData.get("sellingPrice")),
      categoryId: Number(formData.get("categoryId")),
      brandId: formData.get("brandId")
        ? Number(formData.get("brandId")) || null
        : null,
      colorIds: formData.getAll("colorIds"),
      sizeIds: formData.getAll("sizeIds"),
      sku: formData.get("sku") as string,
      description: formData.get("description") as string,
    };

    let image: Images | undefined = undefined;

    if (data.files.length > 0) {
      const processedFile = await processImage(data.files[0], 400, 400);

      const filename = filenameGenerator(
        data.files[0].name,
        "product",
        "/images/products"
      );
      await saveImageBufferToFile(processedFile, filename);

      if (!filename) throw new Error("Failed to upload file to S3");

      logger.info(`File uploaded successfully: ${filename}`);

      image = await createImage({
        url: filename,
      });
    }

    const product = await updateProduct(
      {
        where: { id },
        data: {
          name: data.name,
          sku: data.sku,
          selling_price: data.sellingPrice,
          description: data.description,
          category_id: data.categoryId,
          brand_id: data.brandId,
          image_id: image?.id,
        },
      },
      tx
    );

    if (data.colorIds.length > 0) {
      await tx.products_colors.createMany({
        data: data.colorIds.map((colorId) => ({
          product_id: product.id,
          color_id: Number(colorId),
        })),
        skipDuplicates: true
      });
      logger.info(
        `Product colors linked successfully for product: ${product.id}`
      );
    }

    if (data.sizeIds.length > 0) {
      await tx.products_sizes.createMany({
        data: data.sizeIds.map((sizeId) => ({
          product_id: product.id,
          size_id: Number(sizeId),
        })),
        skipDuplicates: true
      });
      logger.info(
        `Product sizes linked successfully for product: ${product.id}`
      );
    }
    revalidatePath("/inventories/products");
    revalidatePath("/inventories/variants");
    return product;
  });
}

export async function deleteProductOnConfirmed(id: bigint) {
  const deletedProduct = await deleteProduct({ id });
  revalidatePath("/inventories/products");
  revalidatePath("/inventories/variants");
  return deletedProduct;
}
