"use server";

import { createChallan } from "@/services/challan";
import { ChallanItems, Challans } from "@/types/shared";
import { revalidatePath } from "next/cache";

export type CreateChallanInput = Partial<Challans & ChallanItems>;

export async function transferProductsAction(challanData: CreateChallanInput) {
  const challan = await createChallan(challanData);

  revalidatePath("/dashboard");
  revalidatePath("/stock-transfer/transfer-list");
  revalidatePath("/inventories/stock-list");
  revalidatePath("/inventories/stock-history");

  return challan;
}
