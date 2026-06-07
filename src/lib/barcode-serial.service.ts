import prisma from "@/db/prisma";

export function formatBarcodeString(serial: number): string {
  return String(serial).padStart(10, "0");
}

export async function acquireNextSerial(tx: any): Promise<{
  serialId: number;
  serial: number;
  barcodeString: string;
}> {
  // Uses Prisma transaction tx
  const lastRow = (await tx.$queryRawUnsafe(
    "SELECT id, serial FROM barcode_serials ORDER BY serial DESC LIMIT 1 FOR UPDATE"
  )) as Array<{ id: number; serial: number | bigint }>;

  const lastSerial: number =
    lastRow && lastRow.length > 0 ? Number(lastRow[0].serial) : 0;

  const nextSerial = lastSerial + 1;

  const newSerial = await tx.barcode_serials.create({
    data: { serial: nextSerial }
  });

  const barcodeString = formatBarcodeString(nextSerial);

  return {
    serialId: Number(newSerial.id),
    serial: nextSerial,
    barcodeString,
  };
}
