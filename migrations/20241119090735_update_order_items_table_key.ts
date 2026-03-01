import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_items", (table) => {
    table.string("barcode");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("challans", (table) => {
    table.dropColumn("barcode");
  });
}
