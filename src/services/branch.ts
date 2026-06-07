"use server";

import db from "@/db/database";
import { Branches } from "@/types/shared";

export async function getBranches() {
  const branches = await db("branches").orderBy("name", "asc");
  return branches;
}

export async function getBranchById(id: number) {
  const branch = await db("branches").where({ id }).first();
  if (!branch) {
    throw new Error("Branch not found");
  }
  return branch;
}

export async function createBranch(data: Branches) {
  const [insertedData] = await db("branches").insert(data);
  const lastInsertedId = insertedData;

  const [branch] = await db("branches").where({ id: lastInsertedId });
  return branch;
}

export async function updateBranch(id: number, data: Branches) {
  const branch = await db("branches").where({ id }).update(data);
  if (!branch) {
    throw new Error("Branch not found");
  }
  return branch;
}

export async function deleteBranch(id: number) {
  const deletedCount = await db("branches").where({ id }).del();
  if (deletedCount === 0) {
    throw new Error("Branch not found");
  }
  return { message: "Branch deleted successfully" };
}
