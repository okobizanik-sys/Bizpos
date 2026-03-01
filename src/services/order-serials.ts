import db from "@/db/database";
import { OrderSerials } from "@/types/shared";
import { bigint } from "zod";

export async function createOrderSerial(data: OrderSerials) {
  const orderSerial = await db("order_serials").insert(data);

  return orderSerial;
}

export async function getOrderSerial(): Promise<OrderSerials> {
  const orderSerial = await db("order_serials")
    .orderBy("serial", "desc")
    .first();

  return orderSerial;
}
