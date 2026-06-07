import { Knex } from "knex";
import db from "@/db/database";

export function formatBarcodeString(serial: number): string {
  return String(serial).padStart(10, "0");
}

export async function acquireNextSerial(trx: Knex.Transaction): Promise<{
  serialId: number;
  serial: number;
  barcodeString: string;
}> {
  const [lastRow] = await trx.raw(
    "SELECT id, serial FROM barcode_serials ORDER BY serial DESC LIMIT 1 FOR UPDATE",
  );

  const lastSerial: number =
    lastRow && lastRow.length > 0 ? Number(lastRow[0].serial) : 0;

  const nextSerial = lastSerial + 1;

  const [insertId] = await trx("barcode_serials").insert({
    serial: nextSerial,
  });

  const barcodeString = formatBarcodeString(nextSerial);

  return {
    serialId: insertId,
    serial: nextSerial,
    barcodeString,
  };
}
