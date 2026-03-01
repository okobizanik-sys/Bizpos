"use server";

import {
  createBranch,
  deleteBranch,
  getBranchById,
  updateBranch,
} from "@/services/branch";
import { Branches } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: Branches) {
  try {
    await createBranch(data);
    revalidatePath("/branches");
    revalidatePath("/dashboard");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(
  id: number,
  data: Branches
) {
  try {
    await updateBranch(id, data);
    revalidatePath("/branches");
    revalidatePath("/dashboard");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteBranchAction(id: number) {
  const branch = await getBranchById(id);
  if (branch.root) throw new Error("Cannot delete root branch");

  try {
    await deleteBranch(id);
    revalidatePath("/branches");
    revalidatePath("/dashboard");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
