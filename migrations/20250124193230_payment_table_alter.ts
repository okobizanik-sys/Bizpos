import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("payment_methods", function (table) {
    table.dropColumn("type");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("payment_methods", function (table) {
    table.enu("type", ["number", "text", "image", "json"]).notNullable();
  });
}
