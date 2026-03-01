"use server";

import { logger } from "@/lib/winston";
import { getOrderByIdWithItems } from "@/services/order";
import { Branches, Orders } from "@/types/shared";
import { OrderWithItem } from "../../pos/item-selector";
import { revalidatePath } from "next/cache";
import db from "@/db/database";

// export async function returnOrder(
//   formData: FormData,
//   order: Orders,
//   branch?: Branches
// ) {
//   try {
//     await db.transaction(async (trx) => {
//       const comment = formData.get("comment") || "";
//       const ordersId = order?.order_id;
//       const branchId = branch?.id as number;

//       // Fetch the order data
//       const orderData: OrderWithItem[] | null = await getOrderByIdWithItems({
//         where: { "orders.order_id": ordersId },
//       });

//       // console.log(orderData, "from return order action");

//       if (orderData) {
//         for (const orderItem of orderData) {
//           for (const item of orderItem.items) {
//             if (!item.barcode) {
//               continue; // Skip if barcode is missing
//             }

//             const newStockEntries = Array(item.quantity).fill({
//               product_id: Number(item.productId),
//               branch_id: branchId,
//               barcode: item.barcode,
//               ...(item.colorId !== undefined && { color_id: item.colorId }),
//               ...(item.sizeId !== undefined && { size_id: item.sizeId }),
//               cost: Number(item.cost),
//               created_at: new Date(),
//               updated_at: new Date(),
//             });

//             await trx("stocks").insert(newStockEntries);
//           }
//         }
//       }

//       // Update the order status
//       await trx("orders")
//         .where({ order_id: ordersId })
//         .update({ status: "RETURN", comment: comment });
//     });

//     revalidatePath("/orders/orders-list");
//   } catch (error) {
//     logger.error(`Error in returnOrder: ${error}`);
//     throw error;
//   }
// }

export async function returnOrder(
  formData: FormData,
  order: Orders,
  branch?: Branches
) {
  try {
    await db.transaction(async (trx) => {
      const comment = formData.get("comment") || "";
      const ordersId = order?.order_id;
      const branchId = branch?.id as number;

      const orderData: OrderWithItem[] | null = await getOrderByIdWithItems({
        where: { "orders.order_id": ordersId },
      });

      if (orderData) {
        for (const orderItem of orderData) {
          for (const item of orderItem.items) {
            if (!item.barcode) {
              continue;
            }

            const existingStock = await trx("stocks")
              .where({
                product_id: Number(item.productId),
                branch_id: branchId,
                barcode: item.barcode,
              })
              .first();

            if (existingStock) {
              await trx("stocks")
                .where({ id: existingStock.id })
                .update({ quantity: existingStock.quantity + item.quantity });
            } else {
              await trx("stocks").insert({
                product_id: Number(item.productId),
                branch_id: branchId,
                barcode: item.barcode,
                color_id: item.colorId ?? null,
                size_id: item.sizeId ?? null,
                quantity: item.quantity,
                cost: Number(item.cost),
                created_at: new Date(),
                updated_at: new Date(),
              });
            }
          }
        }
      }

      await trx("orders")
        .where({ order_id: ordersId })
        .update({ status: "RETURN", comment });

      revalidatePath("/orders/orders-list");
    });
  } catch (error) {
    logger.error(`Error in returnOrder: ${error}`);
    throw error;
  }
}
