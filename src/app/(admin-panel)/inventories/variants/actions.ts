"use server";

import { deleteCategory, updateCategory } from "@/services/category";
import { VariantType } from "./page";
import { deleteBrand, updateBrand } from "@/services/brand";
import { deleteColor, updateColor } from "@/services/color";
import { deleteSize, updateSize } from "@/services/size";
import { revalidatePath } from "next/cache";

export async function updateFromAction(_: boolean, formData: FormData) {
  const type = formData.get("type") as VariantType;
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;

  switch (type) {
    case "category":
      await updateCategory({ where: { id }, data: { name } });
      break;
    case "brand":
      await updateBrand({ where: { id }, data: { name } });
      break;
    case "color":
      await updateColor({ where: { id }, data: { name } });
      break;
    case "size":
      await updateSize({ where: { id }, data: { name } });
      break;
  }

  revalidatePath("/inventory/variants");
  return true;
}

export async function deleteFormAction(type: VariantType, id: number) {
  let deleted;

  try {
    switch (type) {
      case "category":
        deleted = await deleteCategory({ where: { id } });
        break;
      case "brand":
        deleted = await deleteBrand({ where: { id } });
        break;
      case "color":
        deleted = await deleteColor({ where: { id } });
        break;
      case "size":
        deleted = await deleteSize({ where: { id } });
        break;
    }

    if (deleted) {
      revalidatePath("/inventory/variants");
      return true;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}
