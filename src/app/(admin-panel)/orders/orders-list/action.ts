"use server";

import { logger } from "@/lib/winston";
import { getOrderByIdWithItems } from "@/services/order";
import { Branches, Orders } from "@/types/shared";
import { OrderWithItem } from "../../pos/item-selector";
import { revalidatePath } from "next/cache";
import prisma from "@/db/prisma";

export async function returnOrder(
  formData: FormData,
  order: Orders,
  branch?: Branches
) {
  try {
    await prisma.$transaction(async (tx) => {
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

            const existingStock = await tx.stocks.findFirst({
              where: {
                product_id: BigInt(item.productId ?? 0),
                branch_id: branchId,
                barcode: item.barcode,
              }
            });

            if (existingStock) {
              await tx.stocks.update({
                where: { id: existingStock.id },
                data: { quantity: Number(existingStock.quantity ?? 0) + item.quantity }
              });
            } else {
              await tx.stocks.create({
                data: {
                  product_id: BigInt(item.productId ?? 0),
                  branch_id: branchId,
                  barcode: item.barcode,
                  color_id: item.colorId ?? null,
                  size_id: item.sizeId ?? null,
                  quantity: item.quantity,
                  cost: Number(item.cost),
                  created_at: new Date(),
                  updated_at: new Date(),
                  condition: "new"
                } as any
              });
            }
          }
        }
      }

      await tx.orders.updateMany({
        where: { order_id: ordersId },
        data: { status: "RETURN", comment: comment as string }
      });

      revalidatePath("/orders/orders-list");
    });
  } catch (error) {
    logger.error(`Error in returnOrder: ${error}`);
    throw error;
  }
}
