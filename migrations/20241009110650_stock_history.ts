import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("stock_histories", function (table) {
    table.increments("id").primary();
    table
      .bigInteger("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.string("barcode").notNullable();
    table.string("variant");
    table.integer("quantity").notNullable();
    table.float("cost_per_item").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("stock_histories");
}
