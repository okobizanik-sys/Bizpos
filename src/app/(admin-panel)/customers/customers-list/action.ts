"use server";

import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from "@/services/customer";
import { Customers } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function createFormAction(values: any) {
  try {
    const data: Customers = {
      customer: values.customer,
      phone: values.phone,
      address: values.address,
      group_id: Number(values.groupId),
      membership_id: Number(values.membershipId),
    };
    await createCustomer(data);
    revalidatePath("/customers/customers-list");
    revalidatePath("/customers/fraud-customers");
    revalidatePath("/customers/customers-data");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: number, values: any) {
  try {
    const data: Customers = {
      customer: values.customer,
      phone: values.phone,
      address: values.address,
      group_id: Number(values.groupId),
      membership_id: Number(values.membershipId),
    };
    await updateCustomer(id, data);
    revalidatePath("/customers/customers-list");
    revalidatePath("/customers/fraud-customers");
    revalidatePath("/customers/customers-data");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteCustomerAction(id: number) {
  const customer = await getCustomerById(id);
  // console.log(customer, " from update customer action");

  try {
    await deleteCustomer(id);
    revalidatePath("/customers/customers-list");
    revalidatePath("/customers/fraud-customers");
    revalidatePath("/customers/customers-data");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
