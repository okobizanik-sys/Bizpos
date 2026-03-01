import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("stocks", function (table) {
    table.enu("condition", ["new", "damaged"]).defaultTo("new");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("stocks", function (table) {
    table.dropColumn("condition");
  });
}
