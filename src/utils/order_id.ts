"use server";

import { createOrderSerial, getOrderSerial } from "@/services/order-serials";

export const createOrderId = async () => {
  const today = new Date();
  const formattedDate = `${today.getDate()}${today.getMonth() + 1}${today
    .getFullYear()
    .toString()
    .slice(-2)}`;

  const lastSerial = await getOrderSerial();

  const newSerialNumber = lastSerial ? Number(lastSerial.serial) + 1 : 1;

  const newOrderId = `${formattedDate}${newSerialNumber
    .toString()
    .padStart(3, "0")}`;

  const orderSerial = {
    serial: BigInt(newSerialNumber),
  };
  await createOrderSerial(orderSerial);

  return newOrderId;
};
