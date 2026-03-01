"use server";

import { TStockRow } from "./stock-adder";
import { getColor } from "@/services/color";
import { getSize } from "@/services/size";
import { createStock, createStockHistory } from "@/services/stock";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import db from "@/db/database";
import { Branches } from "@/types/shared";

export async function addStockFormAction(
  productId: number,
  stockRow: TStockRow,
  branch: Branches
) {
  // console.log(productId, "prodct id from action.......");
  // console.log(stockRow, "stock row from action=======");
  // console.log(branch, "branch frm action>>>>>>>>>>>>");

  const color = stockRow.colorId
    ? await getColor({ where: { id: Number(stockRow.colorId) } })
    : null;
  const size = stockRow.sizeId
    ? await getSize({ where: { id: Number(stockRow.sizeId) } })
    : null;

  await db.transaction(async (trx) => {
    // for (let i = 0; i < parseInt(stockRow.quantity); i++) {
    //   await createStock(
    //     {
    //       product_id: BigInt(productId),
    //       branch_id: Number(branch.id),
    //       barcode: stockRow.barcode,
    //       color_id: color?.id,
    //       size_id: size?.id || null,
    //       cost: parseFloat(stockRow.costPerItem),
    //     },
    //     trx
    //   );
    //   console.log(i, "i from stock adder loop");
    // }
    await createStock(
      {
        product_id: Number(productId),
        branch_id: Number(branch.id),
        barcode: stockRow.barcode,
        color_id: color?.id,
        size_id: size?.id || null,
        cost: parseFloat(stockRow.costPerItem),
        quantity: parseInt(stockRow.quantity), // Pass quantity directly
      },
      trx
    );

    await createStockHistory(
      {
        product_id: BigInt(productId),
        barcode: stockRow.barcode,
        variant: (color?.name || "") + " - " + (size?.name || ""),
        quantity: parseInt(stockRow.quantity),
        cost_per_item: parseFloat(stockRow.costPerItem),
      },
      trx
    );
  });

  logger.info(
    `Stock of qty: ${stockRow.quantity} added successfully for product: ${productId}`
  );

  revalidatePath("/dashboard");
  revalidatePath("/inventories/add-stock");
  revalidatePath("/inventories/stock-list");
  revalidatePath("/inventories/stock-history");
}
