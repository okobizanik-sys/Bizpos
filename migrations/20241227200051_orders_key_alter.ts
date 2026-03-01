import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("orders", (table) => {
    table.integer("discount").nullable();
    table.integer("vat").nullable();
    table.integer("delivery_charge").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("orders", (table) => {
    table.dropColumn("discount");
    table.dropColumn("vat");
    table.dropColumn("delivery_charge");
  });
}
