"use server";

import { logger } from "@/lib/winston";
import { getOrderByIdWithItems } from "@/services/order";
import { Branches, Orders } from "@/types/shared";
import { OrderWithItem } from "../../pos/item-selector";
import { revalidatePath } from "next/cache";
import db from "@/db/database";

export async function returnOrderUndo(
  orderData: OrderWithItem[] | null,
  ordersId: string
) {
  try {
    await db.transaction(async (trx) => {
      if (orderData) {
        for (const orderItem of orderData) {
          for (const item of orderItem.items) {
            if (!item.barcode) {
              continue; // Skip if barcode is missing
            }

            const existingStock = await trx("stocks")
              .where({
                product_id: Number(item.productId),
                barcode: item.barcode,
              })
              .first();

            if (existingStock) {
              // Decrease the quantity to undo the return (as stock was increased earlier)
              await trx("stocks")
                .where({ id: existingStock.id })
                .update({
                  quantity: existingStock.quantity - item.quantity,
                });
            } else {
              // If no stock entry exists, handle the error (shouldn't happen in a properly tracked sale)
              logger.error(
                `No stock found for product ${item.productId} with barcode ${item.barcode}.`
              );
              throw new Error("No stock entry found to undo the return.");
            }
          }
        }
      }

      // Update the order status back to 'COMPLETED' and clear the comment
      await trx("orders")
        .where({ order_id: ordersId })
        .update({ status: "COMPLETED", comment: "" });
    });

    revalidatePath("/orders/orders-list");
    revalidatePath("/orders/return-orders");
  } catch (error) {
    logger.error(`Error in returnOrderUndo: ${error}`);
    throw error;
  }
}
