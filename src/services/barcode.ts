import db from "@/db/database";
import { BarcodeSerials } from "@/types/shared";
import { bigint } from "zod";

export async function createBarcodeSerial(data: BarcodeSerials) {
  const barcodeSerial = await db("barcode_serials").insert(data);

  return barcodeSerial;
}

export async function getBarcodeSerial(): Promise<BarcodeSerials> {
  const barcodeSerial = await db("barcode_serials")
    .orderBy("serial", "desc")
    .first();

  return barcodeSerial;
}
