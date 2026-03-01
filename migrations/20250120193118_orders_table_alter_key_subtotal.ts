import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("orders", (table) => {
    table.integer("sub_total").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("orders", (table) => {
    table.dropColumn("sub_total");
  });
}
