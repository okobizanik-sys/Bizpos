"use server";

import prisma from "@/db/prisma";
import { BarcodeSerials } from "@/types/shared";

export async function createBarcodeSerial(data: BarcodeSerials) {
  return await prisma.barcode_serials.create({ data: data as any });
}

export async function getBarcodeSerial(): Promise<BarcodeSerials | null> {
  const barcodeSerial = await prisma.barcode_serials.findFirst({
    orderBy: { serial: "desc" },
  });

  return barcodeSerial as unknown as BarcodeSerials;
}
