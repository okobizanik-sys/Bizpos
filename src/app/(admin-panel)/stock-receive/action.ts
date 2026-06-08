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
          if (!item.barcode || item.to_branch_id == null || item.quantity == null) {
            throw new Error("Invalid challan item payload for stock receive.");
          }

          const stock = await updateStockBranchId(
            item.challanId,
            Number(item.to_branch_id),
            Number(item.quantity),
            String(item.barcode),
            tx
          );

          logger.info(`Stock branch ID updated successfully! ${JSON.stringify(stock)}`);
        }
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/stock-transfer/transfer-list");
    revalidatePath("/inventories/stock-list");
    revalidatePath("/inventories/stock-history");
    return { success: true, message: "Stock receive successful!" };
  } catch (error: any) {
    logger.error("Stock receive failed.", {
      error: error?.message || error,
      stack: error?.stack,
      challanItemList,
      challanId: challan?.id,
    });
    throw new Error("Stock receive failed. Please try again.");
  }
}
