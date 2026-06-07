"use server";

import prisma from "@/db/prisma";
import type { ProductSizes } from "@/types/shared";

export async function getSizes() {
  return await prisma.sizes.findMany({ orderBy: { name: "asc" } });
}

export async function getProductSizes(productId: number): Promise<ProductSizes[]> {
  const rawSizes = await prisma.$queryRaw<ProductSizes[]>`
    SELECT ps.*, s.id, s.name 
    FROM products_sizes ps
    LEFT JOIN products p ON ps.product_id = p.id
    LEFT JOIN sizes s ON ps.size_id = s.id
    WHERE ps.product_id = ${BigInt(productId)}
  `;
  return rawSizes;
}

export async function getSize(params: { where: { id: number } }) {
  const size = await prisma.sizes.findFirst({ where: { id: params.where.id } });
  if (!size) {
    throw new Error("Size not found");
  }
  return size;
}

export async function createSize(data: { name: string }) {
  return await prisma.sizes.create({ data });
}

export async function updateSize(params: {
  where: { id: number };
  data: { name: string };
}) {
  const size = await prisma.sizes.update({
    where: { id: params.where.id },
    data: params.data,
  });
  return size;
}

export async function deleteSize(params: { where: { id: number } }) {
  const size = await prisma.sizes.delete({
    where: { id: params.where.id },
  });
  return size;
}
