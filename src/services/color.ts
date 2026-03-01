"use server";

import db from "@/db/database";

// Get all colors
export async function getColors() {
  const colors = await db("colors").orderBy("name", "asc");
  return colors;
}

export async function getProductColors(productId: number) {
  const colors = await db("products_colors")
    .leftJoin("products", "products_colors.product_id", "products.id")
    .leftJoin("colors", "products_colors.color_id", "colors.id")
    .select("products_colors.*", "colors.id", "colors.name")
    // .groupBy("products_colors.product_id", "products_colors.color_id")
    .where({ product_id: productId });
  return colors;
}

// Get a color by unique identifier
export async function getColor(params: { where: { id: number } }) {
  const color = await db("colors").where(params.where).first();
  if (!color) {
    throw new Error("Color not found");
  }
  return color;
}

// Create a new color
export async function createColor(data: {}) {
  const [color] = await db("colors").insert(data);
  return color;
}

// Update a color by unique identifier
export async function updateColor(params: {
  where: { id: number }; // Adjust the unique field as necessary
  data: { name?: string /* other fields */ };
}) {
  const insertResult = await db("colors")
    .where(params.where)
    .update(params.data);

  const color = await db("colors").where({ id: insertResult });
  
  if (!color) {
    throw new Error("Color not found");
  }
  return color;
}

// Delete a color by unique identifier
export async function deleteColor(params: {
  where: { id: number }; // Adjust the unique field as necessary
}) {
  const deletedCount = await db("colors").where(params.where).del();
  if (deletedCount === 0) {
    throw new Error("Color not found");
  }
  return { message: "Color deleted successfully" };
}
