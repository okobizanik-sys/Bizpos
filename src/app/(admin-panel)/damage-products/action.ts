"use server";

import { Branches } from "@/types/shared";
import { POSItem } from "../pos/item-selector";
import {
  decreaseStock,
  increaseStock,
} from "@/services/stock";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import prisma from "@/db/prisma";

export async function DamageProductForm(branch: Branches, itemList: POSItem[]) {
  try {
    await prisma.$transaction(async (tx) => {
      if (branch.id) {
        for (const item of itemList) {
          await decreaseStock(item.barcode, item.quantity, tx);

          await increaseStock(
            Number(item.productId),
            branch.id,
            item.quantity,
            Number(item.cost),
            item.barcode,
            item.colorId ? Number(item.colorId) : undefined,
            item.sizeId ? Number(item.sizeId) : undefined,
            "damaged",
            tx
          );
        }
      }

      logger.info("Damaged product added successfully");

      revalidatePath("/damage-products");
      revalidatePath("/stocks/stocks-list");
      revalidatePath("/stocks/stock-history");
      revalidatePath("/dashboard");

      return { status: true, message: "Damaged stock added successfully" };
    });
  } catch (error: any) {
    logger.error(`Error adding damaged stock: ${error}`);
    throw new Error(error.message || "Failed to add damaged stocks");
  }
}
