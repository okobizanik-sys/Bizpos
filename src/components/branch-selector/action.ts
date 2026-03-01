"use server";

import { getBranchById, getBranches } from "@/services/branch";

export async function getAllBranches() {
  return await getBranches();
}

export async function getBranch(id: number) {
  return await getBranchById(id);
}
