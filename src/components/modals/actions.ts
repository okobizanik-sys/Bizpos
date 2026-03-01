"use server";

import { createBrand } from "@/services/brand";
import { createCategory } from "@/services/category";
import { createColor } from "@/services/color";
import { createGroup } from "@/services/group";
import { createMembership } from "@/services/membership";
import { createSize } from "@/services/size";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().max(120).min(1),
});

type StateType = {
  status: boolean;
  error: any;
};

export async function createCategoryAction(_: StateType, formData: FormData) {
  const validatedField = schema.safeParse({
    name: formData.get("name") as string,
  });

  if (!validatedField.success) {
    return {
      status: false,
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    await createCategory({ name: validatedField.data.name });

    revalidatePath("/inventories/add-product");
    revalidatePath("/inventories/products");
    revalidatePath("/inventories/variants");
    return {
      status: true,
      error: null,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createBrandAction(_: StateType, formData: FormData) {
  const validatedField = schema.safeParse({
    name: formData.get("name") as string,
  });

  if (!validatedField.success) {
    return {
      status: false,
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    await createBrand({ name: validatedField.data.name });

    revalidatePath("/inventories/add-product");
    revalidatePath("/inventories/products");
    revalidatePath("/inventories/variants");
    return {
      status: true,
      error: null,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createColorAction(_: StateType, formData: FormData) {
  const validatedField = schema.safeParse({
    name: formData.get("name") as string,
  });

  if (!validatedField.success) {
    return {
      status: false,
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    await createColor({ name: validatedField.data.name });

    revalidatePath("/inventories/add-product");
    revalidatePath("/inventories/products");
    revalidatePath("/inventories/variants");
    return {
      status: true,
      error: null,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createSizeAction(_: StateType, formData: FormData) {
  const validatedField = schema.safeParse({
    name: formData.get("name") as string,
  });

  if (!validatedField.success) {
    return {
      status: false,
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    await createSize({ name: validatedField.data.name });

    revalidatePath("/inventories/add-product");
    revalidatePath("/inventories/products");
    revalidatePath("/inventories/variants");
    return {
      status: true,
      error: null,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createGroupAction(_: StateType, formData: FormData) {
  // Validate the input data
  const validatedField = schema.safeParse({
    name: formData.get("name") as string,
  });

  if (!validatedField.success) {
    return {
      status: false,
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    // Call the service to create the group
    await createGroup({ name: validatedField.data.name });

    // Revalidate paths if needed
    // revalidatePath("/groups");
    return {
      status: true,
      error: null,
    };
  } catch (error: any) {
    return {
      status: false,
      error: error.message,
    };
  }
}

export async function createMembershipAction(_: StateType, formData: FormData) {
  // Validate the input data
  const validatedField = schema.safeParse({
    type: formData.get("type") as string,
    description: formData.get("description") as string,
  });

  if (!validatedField.success) {
    return {
      status: false,
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    // Call the service to create the membership
    await createMembership({
      type: validatedField.data.name,
    });

    // Revalidate paths if needed
    // revalidatePath("/memberships");
    return {
      status: true,
      error: null,
    };
  } catch (error: any) {
    return {
      status: false,
      error: error.message,
    };
  }
}