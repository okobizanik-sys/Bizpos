import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products", function (table) {
    table.bigIncrements("id").primary();
    table.string("name").notNullable();
    table.string("sku").unique().notNullable();
    table.float("selling_price").notNullable();
    table.string("description");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("products");
}
