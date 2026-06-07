"use server";

import prisma from "@/db/prisma";

export async function getCategories() {
  return await prisma.categories.findMany({ orderBy: { name: "asc" } });
}

export async function getCategory(params: { where: { id: number } }) {
  const category = await prisma.categories.findFirst({ where: params.where });
  if (!category) throw new Error("Category not found");
  return category;
}

export async function createCategory(data: { name: string }) {
  return await prisma.categories.create({ data });
}

export async function updateCategory(params: {
  where: { id: number };
  data: { name?: string };
}) {
  return await prisma.categories.update({ where: params.where, data: params.data });
}

export async function deleteCategory(params: { where: { id: number } }) {
  await prisma.categories.delete({ where: params.where });
  return { message: "Category deleted successfully" };
}
