"use server";

import { logger } from "@/lib/winston";
import { OrderWithItem } from "../../pos/item-selector";
import { revalidatePath } from "next/cache";
import prisma from "@/db/prisma";

export async function returnOrderUndo(
  orderData: OrderWithItem[] | null,
  ordersId: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      if (orderData) {
        for (const orderItem of orderData) {
          for (const item of orderItem.items) {
            if (!item.barcode) {
              continue; // Skip if barcode is missing
            }

            const existingStock = await tx.stocks.findFirst({
              where: {
                product_id: BigInt(item.productId ?? 0),
                barcode: item.barcode,
              }
            });

            if (existingStock) {
              await tx.stocks.update({
                where: { id: existingStock.id },
                data: {
                  quantity: Number(existingStock.quantity ?? 0) - item.quantity,
                }
              });
            } else {
              logger.error(
                `No stock found for product ${item.productId} with barcode ${item.barcode}.`
              );
              throw new Error("No stock entry found to undo the return.");
            }
          }
        }
      }

      await tx.orders.updateMany({
        where: { order_id: ordersId },
        data: { status: "COMPLETED", comment: "" }
      });
    });

    revalidatePath("/orders/orders-list");
    revalidatePath("/orders/return-orders");
  } catch (error) {
    logger.error(`Error in returnOrderUndo: ${error}`);
    throw error;
  }
}
