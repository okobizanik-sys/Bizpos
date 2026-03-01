"use server";

import db from "@/db/database";
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
    // console.log(challanItemList, "from receive stock action");
    await db.transaction(async (trx) => {
      if (challan) {
        const challanResponse = await updateChallanStatus(challan.id, trx);

        logger.info(`Challan status updated successfully! ${challanResponse}`);
      }

      for (const item of challanItemList) {
        if (item.id !== undefined) {
          const stock = await updateStockBranchId(
            item.challanId,
            item.to_branch_id,
            item.quantity,
            item.barcode,
            trx
          );

          logger.info(`Stock branch ID updated successfully! ${stock}`);
        } else {
          // console.error("Item ID is undefined for item:", item.name);
        }
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/stock-transfer/transfer-list");
    revalidatePath("/inventories/stock-list");
    revalidatePath("/inventories/stock-history");
    return { success: true, message: "Stock receive successful!" };
  } catch (error) {
    // console.error("Error during stock receive:", error);
    throw new Error("Stock receive failed. Please try again.");
  }
}
