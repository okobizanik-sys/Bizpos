"use server";

import prisma from "@/db/prisma";

export async function getBrands() {
  return await prisma.brands.findMany({ orderBy: { name: "asc" } });
}

export async function getBrand(params: { where: { id: number } }) {
  return await prisma.brands.findFirst({ where: params.where });
}

export async function createBrand(data: { name: string }) {
  return await prisma.brands.create({ data });
}

export async function updateBrand(params: {
  where: { id: number };
  data: { name?: string };
}) {
  return await prisma.brands.update({ where: params.where, data: params.data });
}

export async function deleteBrand(params: { where: { id: number } }) {
  return await prisma.brands.delete({ where: params.where });
}
