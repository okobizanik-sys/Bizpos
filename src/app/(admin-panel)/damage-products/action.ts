"use server";

import { Branches } from "@/types/shared";
import { POSItem } from "../pos/item-selector";
import {
  decreaseStock,
  increaseStock,
  updateStockCondition,
} from "@/services/stock";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import db from "@/db/database";

export async function DamageProductForm(branch: Branches, itemList: POSItem[]) {
  try {
    await db.transaction(async (trx) => {
      if (branch.id) {
        for (const item of itemList) {
          await decreaseStock(item.barcode, item.quantity, trx);

          await increaseStock(
            Number(item.productId),
            branch.id,
            item.quantity,
            Number(item.cost),
            item.barcode,
            item.colorId,
            item.sizeId,
            "damaged",
            trx
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
