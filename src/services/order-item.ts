"use server";

import prisma from "@/db/prisma";
import { OrderItem } from "@/types/shared";

export async function createOrderItems(data: OrderItem[]) {
  // Prisma createMany does not return the created records, just a count.
  // To keep compatibility, we can do this in a transaction or simply return count/success.
  // The original returned insertedOrderItems. We can create them sequentially or use transaction.
  const insertedItems = await prisma.$transaction(
    data.map(item => prisma.order_items.create({ data: item as any }))
  );
  
  return insertedItems;
}

export async function updateOrderItems(data: OrderItem[]) {
  const updatedOrderItems = [];

  for (const item of data) {
    const { id, ...updateFields } = item as any; 

    const updatedItem = await prisma.order_items.update({
      where: { id: BigInt(id) },
      data: updateFields,
    });

    updatedOrderItems.push(updatedItem);
  }

  return updatedOrderItems;
}
