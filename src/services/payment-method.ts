"use server";

import db from "@/db/database";
import { logger } from "@/lib/winston";
import { PaymentMethods } from "@/types/shared";

export async function createPaymentMethods(data: PaymentMethods) {
  const [insertResult] = await db("payment_methods").insert(data);
  const lastInsertId = insertResult;

  const paymentMethod = await db("payment_methods")
    .where({ id: lastInsertId })
    .select("*")
    .first();

  logger.info(`Payment Methods created successfully: ${paymentMethod.id}`);
  return paymentMethod;
}

export async function getPaymentMethods(): Promise<PaymentMethods[]> {
  const query = db("payment_methods").select("*");

  const paymentMethods = await query;
  return paymentMethods;
}

export async function deletePaymentMethod(params: {
  where: { id: number }; // Adjust the unique field as necessary
}) {
  const deletedCount = await db("payment_methods").where(params.where).del();
  if (deletedCount === 0) {
    throw new Error("PaymentMethod not found");
  }
  return { message: "PaymentMethod deleted successfully" };
}
