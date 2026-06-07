"use server";

import prisma from "@/db/prisma";
import { Groups } from "@/types/shared";

export async function getGroups(): Promise<Groups[]> {
  return await prisma.groups.findMany({ orderBy: { name: "asc" } });
}

export async function getGroup(params: {
  where: { id: number };
}) {
  const group = await prisma.groups.findFirst({ where: params.where });
  if (!group) {
    throw new Error("Group not found");
  }
  return group;
}

export async function createGroup(data: { name: string }) {
  return await prisma.groups.create({ data });
}

export async function updateGroup(params: {
  where: { id: number };
  data: { name?: string };
}) {
  return await prisma.groups.update({ where: params.where, data: params.data });
}

export async function deleteGroup(params: {
  where: { id: number };
}) {
  await prisma.groups.delete({ where: params.where });
  return { message: "Group deleted successfully" };
}
