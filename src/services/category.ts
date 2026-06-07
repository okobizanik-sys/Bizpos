"use server";

import db from "@/db/database";

export async function getCategories() {
  return await db("categories").orderBy("name", "asc");
}

export async function getCategory(params: {
  where: { id: number }; // Adjust the unique field as necessary
}) {
  const category = await db("categories").where(params.where).first();
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
}

export async function createCategory(data: { name: string }) {
  const [category] = await db("categories").insert(data);
  return category;
}

export async function updateCategory(params: {
  where: { id: number }; // Adjust the unique field as necessary
  data: { name?: string }; // Adjust fields as necessary
}) {
  const insertResult = await db("categories")
    .where(params.where)
    .update(params.data);
  const category = await db("categories").where({ id: insertResult });
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
}

export async function deleteCategory(params: {
  where: { id: number }; // Adjust the unique field as necessary
}) {
  const deletedCount = await db("categories").where(params.where).del();
  if (deletedCount === 0) {
    throw new Error("Category not found");
  }
  return { message: "Category deleted successfully" };
}
