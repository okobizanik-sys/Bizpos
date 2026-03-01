"use server";

import db from "@/db/database"; // Adjust the import based on your setup

export async function getSizes() {
  return await db("sizes").orderBy("name", "asc");
}

export async function getProductSizes(productId: number) {
  const sizes = await db("products_sizes")
    .leftJoin("products", "products_sizes.product_id", "products.id")
    .leftJoin("sizes", "products_sizes.size_id", "sizes.id")
    .select("products_sizes.*", "sizes.id", "sizes.name")
    // .groupBy("products_sizes.product_id", "products_sizes.size_id")
    .where({ product_id: productId });
  return sizes;
}

export async function getSize(params: { where: { id: number } }) {
  const size = await db("sizes").where({ id: params.where.id }).first(); // Assuming 'id' is the unique identifier
  if (!size) {
    throw new Error("Size not found");
  }
  return size;
}

export async function createSize(data: { name: string }) {
  const [size] = await db("sizes").insert(data);
  return size;
}

export async function updateSize(params: {
  where: { id: number };
  data: { name: string };
}) {
  const insertResult = await db("sizes")
    .where({ id: params.where.id })
    .update(params.data);

  const size = await db("sizes").where({ id: insertResult });
  
  if (!size) {
    throw new Error("Size not found");
  }
  return size;
}

export async function deleteSize(params: { where: { id: number } }) {
  const deletedSize = await db("sizes")
    .where({ id: params.where.id })
    .del()
    .returning("*"); // Returns the deleted size
  if (!deletedSize.length) {
    throw new Error("Size not found");
  }
  return deletedSize[0];
}
