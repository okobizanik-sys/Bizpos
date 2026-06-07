"use server";

import prisma from "@/db/prisma";
import { logger } from "@/lib/winston";
import { updateChallanStatus } from "@/services/challan";
import { updateStockBranchId } from "@/services/stock";
import { ChallanItems, Challans } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function StockReceiveAction(
  challanItemList: ChallanItems[],
  challan: Challans | undefined
) {
  try {
    await prisma.$transaction(async (tx) => {
      if (challan) {
        const challanResponse = await updateChallanStatus(challan.id, tx);

        logger.info(`Challan status updated successfully! ${challanResponse}`);
      }

      for (const item of challanItemList) {
        if (item.id !== undefined) {
          const stock = await updateStockBranchId(
            item.challanId,
            item.to_branch_id,
            item.quantity,
            item.barcode,
            tx
          );

          logger.info(`Stock branch ID updated successfully! ${stock}`);
        } else {
        }
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/stock-transfer/transfer-list");
    revalidatePath("/inventories/stock-list");
    revalidatePath("/inventories/stock-history");
    return { success: true, message: "Stock receive successful!" };
  } catch (error) {
    throw new Error("Stock receive failed. Please try again.");
  }
}
