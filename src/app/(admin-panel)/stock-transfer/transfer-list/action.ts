"use server";

import { deleteChallan } from "@/services/challan";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const filterSubmitAction = async (formData: FormData) => {
  const searchParams = new URLSearchParams();
  const challan = formData.get("challan") as string;
  const status = formData.get("status") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  if (challan) {
    searchParams.set("challan", challan);
  }

  if (status) {
    searchParams.set("status", status);
  }

  if (start_date) {
    searchParams.set("start_date", start_date);
  }

  if (end_date) {
    searchParams.set("end_date", end_date);
  }

  const search = searchParams.toString();

  redirect(`/stock-transfer/transfer-list${search ? `?${search}` : ""}`);
};

export async function deleteChallanAction(challanId: bigint) {
  await deleteChallan({ where: { id: Number(challanId) } });

  revalidatePath("/dashboard");
  revalidatePath("/stock-transfer/transfer-list");
  revalidatePath("/inventories/stock-list");
  revalidatePath("/inventories/stock-history");
}
