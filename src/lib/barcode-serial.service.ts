import { Knex } from "knex";
import db from "@/db/database";

/**
 * Zero-pads a serial number to 10 digits.
 * e.g. formatBarcodeString(12) => "0000000012"
 */
export function formatBarcodeString(serial: number): string {
  return String(serial).padStart(10, "0");
}

/**
 * Acquires the next barcode serial inside an existing transaction.
 * Uses SELECT ... FOR UPDATE to prevent race conditions under concurrent inserts.
 *
 * @param trx  - An active Knex transaction object
 * @returns    - { serialId, serial, barcodeString }
 */
export async function acquireNextSerial(trx: Knex.Transaction): Promise<{
  serialId: number;
  serial: number;
  barcodeString: string;
}> {
  // Lock the latest row to prevent concurrent serial collisions
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
