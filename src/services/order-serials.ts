"use server";

import prisma from "@/db/prisma";
import { OrderSerials } from "@/types/shared";

export async function createOrderSerial(data: OrderSerials) {
  return await prisma.order_serials.create({ data: data as any });
}

export async function getOrderSerial(): Promise<OrderSerials | null> {
  const orderSerial = await prisma.order_serials.findFirst({
    orderBy: { serial: "desc" },
  });

  return orderSerial as unknown as OrderSerials;
}
