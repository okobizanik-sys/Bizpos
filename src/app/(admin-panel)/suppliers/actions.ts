"use server";

import { revalidatePath } from "next/cache";
import { createSupplier, deleteSupplier } from "@/services/supplier";

export async function createSupplierAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (!name) {
    throw new Error("Supplier name is required.");
  }

  const supplier = await createSupplier({ name, email, phone, address });

  revalidatePath("/suppliers");
  revalidatePath("/sales/sales-list");
  revalidatePath("/orders/orders-list");
  revalidatePath("/pos");

  return supplier;
}

export async function deleteSupplierAction(id: number) {
  await deleteSupplier(id);

  revalidatePath("/suppliers");
  revalidatePath("/sales/sales-list");
  revalidatePath("/orders/orders-list");
  revalidatePath("/pos");

  return { success: true };
}
