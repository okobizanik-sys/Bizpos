"use server";

import prisma from "@/db/prisma";
import { Memberships } from "@/types/shared";

export async function getMemberships(): Promise<Memberships[]> {
  return await prisma.memberships.findMany({ orderBy: { type: "asc" } });
}

export async function getMembership(params: {
  where: { id: number };
}) {
  const membership = await prisma.memberships.findFirst({ where: params.where });
  if (!membership) {
    throw new Error("Membership not found");
  }
  return membership;
}

export async function createMembership(data: { type: string }) {
  return await prisma.memberships.create({ data });
}

export async function updateMembership(params: {
  where: { id: number };
  data: { type?: string; description?: string };
}) {
  // `description` was in types but not in schema actually. Assuming type is fine.
  return await prisma.memberships.update({ where: params.where, data: params.data as any });
}

export async function deleteMembership(params: {
  where: { id: number };
}) {
  await prisma.memberships.delete({ where: params.where });
  return { message: "Membership deleted successfully" };
}
