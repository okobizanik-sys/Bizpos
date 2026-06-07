"use server";

import prisma from "@/db/prisma";
import type { ProductColors } from "@/types/shared";

export async function getColors() {
  return await prisma.colors.findMany({ orderBy: { name: "asc" } });
}

export async function getProductColors(productId: number): Promise<ProductColors[]> {
  const rawColors = await prisma.$queryRaw<ProductColors[]>`
    SELECT pc.*, c.id, c.name 
    FROM products_colors pc
    LEFT JOIN products p ON pc.product_id = p.id
    LEFT JOIN colors c ON pc.color_id = c.id
    WHERE pc.product_id = ${BigInt(productId)}
  `;
  return rawColors;
}

export async function getColor(params: { where: { id: number } }) {
  const color = await prisma.colors.findFirst({ where: params.where });
  if (!color) {
    throw new Error("Color not found");
  }
  return color;
}

export async function createColor(data: { name: string }) {
  return await prisma.colors.create({ data });
}

export async function updateColor(params: {
  where: { id: number };
  data: { name?: string };
}) {
  const color = await prisma.colors.update({
    where: params.where,
    data: params.data,
  });
  return color;
}

export async function deleteColor(params: { where: { id: number } }) {
  await prisma.colors.delete({ where: params.where });
  return { message: "Color deleted successfully" };
}
