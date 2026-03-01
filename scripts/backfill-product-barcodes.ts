/**
 * One-time backfill script: assigns barcodes to all products that don't have one yet.
 *
 * Run with:
 *   npx ts-node scripts/backfill-product-barcodes.ts
 */

import knex, { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

function formatBarcodeString(serial: number): string {
  return String(serial).padStart(10, "0");
}

async function acquireNextSerial(
  trx: Knex.Transaction,
): Promise<{ serialId: number; serial: number; barcodeString: string }> {
  const [rows] = await trx.raw(
    "SELECT id, serial FROM barcode_serials ORDER BY serial DESC LIMIT 1 FOR UPDATE",
  );
  const lastSerial: number =
    rows && rows.length > 0 ? Number(rows[0].serial) : 0;
  const nextSerial = lastSerial + 1;

  const [insertId] = await trx("barcode_serials").insert({
    serial: nextSerial,
  });
  const barcodeString = formatBarcodeString(nextSerial);

  return { serialId: insertId, serial: nextSerial, barcodeString };
}

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
  },
  pool: { min: 0, max: 3 },
  acquireConnectionTimeout: 5000,
});

async function main() {
  console.log("Starting barcode backfill...");

  // Fetch all products without a barcode, ordered by id ascending
  const products = await db("products")
    .whereNull("barcode")
    .orderBy("id", "asc")
    .select("id", "name");

  console.log(`Found ${products.length} products without a barcode.`);

  if (products.length === 0) {
    console.log("Nothing to backfill. Exiting.");
    await db.destroy();
    process.exit(0);
  }

  for (const product of products) {
    await db.transaction(async (trx) => {
      const { serialId, barcodeString } = await acquireNextSerial(trx);

      await trx("products").where({ id: product.id }).update({
        barcode: barcodeString,
        barcode_serial_id: serialId,
      });

      console.log(`  [${product.id}] "${product.name}" => ${barcodeString}`);
    });
  }

  console.log(`Backfill complete. ${products.length} product(s) updated.`);
  await db.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});
