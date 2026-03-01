"use server";

import { logger } from "@/lib/winston";
import { updateCustomer } from "@/services/customer";
import { Customers } from "@/types/shared";

export async function notFraudFormAction(customer: Customers) {
  try {
    const notFraudData = {
      customer: customer.customer,
      address: customer.address,
      phone: customer.phone,
      fraud: "false",
      remarks: "",
    };
    const result = await updateCustomer(Number(customer.id), notFraudData);
    return { success: true, message: "successful", data: result };
  } catch (error) {
    logger.error(`Error in returnOrder: ${error}`);
    throw error;
  }
}
