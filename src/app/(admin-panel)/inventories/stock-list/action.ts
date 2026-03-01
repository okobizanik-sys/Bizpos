"use server";

import { updateStockQuantity } from "@/services/stock";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const filterSubmitAction = async (formData: FormData) => {
  const searchParams = new URLSearchParams();
  const global = formData.get("global") as string;
  const stock_type = formData.get("stock_type") as string;
  const category = formData.get("category") as string;
  const branch = formData.get("branch") as string;

  if (global) {
    searchParams.set("global", global);
  }

  if (stock_type) {
    searchParams.set("stock_type", stock_type);
  }

  if (category) {
    searchParams.set("category", category);
  }

  if (branch) {
    searchParams.set("branch", branch);
  }

  const search = searchParams.toString();

  redirect(`/inventories/stock-list${search ? `?${search}` : ""}`);
};

export const updateStockAction = async (barcode: string, quantity: number) => {
  try {
    const updatedStock = await updateStockQuantity(quantity, barcode);

    revalidatePath("/dashboard");
    revalidatePath("/inventories/add-stock");
    revalidatePath("/inventories/stock-list");
    revalidatePath("/inventories/stock-history");

    return {
      success: true,
      data: updatedStock,
      message: "Stock quantity updated successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
