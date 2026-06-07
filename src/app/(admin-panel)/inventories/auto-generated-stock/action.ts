"use server";

import type { TStockRow } from "./stock-adder";
import { getColor } from "@/services/color";
import { getSize } from "@/services/size";
import { createStock, createStockHistory } from "@/services/stock";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import prisma from "@/db/prisma";
import type { Branches } from "@/types/shared";

export async function addStockFormAction(
  productId: number,
  stockRow: TStockRow,
  branch: Branches
) {

  const color = stockRow.colorId
    ? await getColor({ where: { id: Number(stockRow.colorId) } })
    : null;
  const size = stockRow.sizeId
    ? await getSize({ where: { id: Number(stockRow.sizeId) } })
    : null;

  await prisma.$transaction(async (tx) => {
    await createStock(
      {
        product_id: Number(productId),
        branch_id: Number(branch.id),
        barcode: stockRow.barcode,
        color_id: color?.id as any,
        size_id: size?.id as any,
        cost: parseFloat(stockRow.costPerItem),
        quantity: parseInt(stockRow.quantity),
        product_date: stockRow.productDate || null,
        shelf_life: stockRow.shelfLife ? Number(stockRow.shelfLife) : null,
        expire_date: stockRow.expireDate || null,
        supplier_name: stockRow.supplierName || null,
      },
      tx
    );

    await createStockHistory(
      {
        product_id: BigInt(productId),
        barcode: stockRow.barcode,
        variant: (color?.name || "") + " - " + (size?.name || ""),
        quantity: parseInt(stockRow.quantity),
        cost_per_item: parseFloat(stockRow.costPerItem),
        paid_amount: Number(stockRow.paidAmount || 0),
        due_amount: Number(stockRow.dueAmount || 0),
        product_date: stockRow.productDate || null,
        shelf_life: stockRow.shelfLife ? Number(stockRow.shelfLife) : null,
        expire_date: stockRow.expireDate || null,
        supplier_name: stockRow.supplierName || null,
      },
      tx
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
