"use server";

import prisma from "@/db/prisma";
import { logger } from "@/lib/winston";
import { PaymentMethods } from "@/types/shared";

export async function createPaymentMethods(data: PaymentMethods) {
  const paymentMethod = await prisma.payment_methods.create({ data: data as any });
  logger.info(`Payment Methods created successfully: ${paymentMethod.id}`);
  return paymentMethod as unknown as PaymentMethods;
}

export async function getPaymentMethods(): Promise<PaymentMethods[]> {
  const paymentMethods = await prisma.payment_methods.findMany();
  return paymentMethods as unknown as PaymentMethods[];
}

export async function deletePaymentMethod(params: {
  where: { id: number };
}) {
  await prisma.payment_methods.delete({ where: params.where });
  return { message: "PaymentMethod deleted successfully" };
}
