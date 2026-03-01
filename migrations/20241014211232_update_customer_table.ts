import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("customers", (table) => {
    table.dropColumn("product_id");
  });
}

export async function down(knex: Knex): Promise<void> {}
