/**
 * One-off: applies the barcode columns to products table, bypassing the corrupt migration state.
 * Run: npx ts-node scripts/apply-barcode-migration.ts
 */
import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
  },
  pool: { min: 0, max: 1 },
  acquireConnectionTimeout: 5000,
});

async function main() {
  const hasBarcode = await db.schema.hasColumn("products", "barcode");
  const hasSerialId = await db.schema.hasColumn(
    "products",
    "barcode_serial_id",
  );

  if (!hasBarcode) {
    console.log("Adding 'barcode' column to products...");
    await db.schema.alterTable("products", (table) => {
      table.string("barcode", 64).nullable().unique();
    });
    console.log("  Done.");
  } else {
    console.log("'barcode' column already exists — skipping.");
  }

  if (!hasSerialId) {
    console.log("Adding 'barcode_serial_id' column to products...");
    await db.schema.alterTable("products", (table) => {
      // Must be INT UNSIGNED to match barcode_serials.id (created by increments())
      table
        .integer("barcode_serial_id")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("barcode_serials")
        .onDelete("SET NULL");
    });
    console.log("  Done.");
  } else {
    console.log("'barcode_serial_id' column already exists — skipping.");
  }

  console.log("Migration applied successfully.");
  await db.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
