import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("stocks", function (table) {
    table.integer("quantity");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("stocks", function (table) {
    table.integer("quantity");
  });
}
