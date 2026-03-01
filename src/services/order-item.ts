"use server";

import db from "@/db/database";
import { OrderItem } from "@/types/shared";

export async function createOrderItems(data: OrderItem[]) {
  const [insertedIds] = await db("order_items").insert(data);
  const lastInsertId = insertedIds;

  const insertedOrderItems = await db("order_items").where({
    id: lastInsertId,
  });
  return insertedOrderItems;
}

export async function updateOrderItems(data: OrderItem[]) {
  const updatedOrderItems = [];

  for (const item of data) {
    const { id, ...updateFields } = item; // Destructure the item to separate `id` from fields to update

    // Update each item by `id`
    await db("order_items").where({ id }).update(updateFields);

    // Fetch the updated item to return in response
    const updatedItem = await db("order_items").where({ id }).first();
    updatedOrderItems.push(updatedItem);
  }

  return updatedOrderItems; // Return the array of updated items
}
