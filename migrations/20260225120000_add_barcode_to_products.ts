import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("products", function (table) {
    table.string("barcode", 64).nullable().unique();
    table
      .integer("barcode_serial_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("barcode_serials")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("products", function (table) {
    table.dropForeign(["barcode_serial_id"]);
    table.dropColumn("barcode_serial_id");
    table.dropColumn("barcode");
  });
}
