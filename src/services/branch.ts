"use server";

import prisma from "@/db/prisma";
import { Branches } from "@/types/shared";

export async function getBranches() {
  return await prisma.branches.findMany({ orderBy: { name: "asc" } });
}

export async function getBranchById(id: number) {
  const branch = await prisma.branches.findFirst({ where: { id } });
  if (!branch) {
    throw new Error("Branch not found");
  }
  return branch;
}

export async function createBranch(data: Branches) {
  // Omit id if present
  const { id, ...createData } = data;
  return await prisma.branches.create({ data: createData });
}

export async function updateBranch(id: number, data: Branches) {
  const { id: _, ...updateData } = data;
  const branch = await prisma.branches.update({
    where: { id },
    data: updateData,
  });
  return branch;
}

export async function deleteBranch(id: number) {
  await prisma.branches.delete({ where: { id } });
  return { message: "Branch deleted successfully" };
}
