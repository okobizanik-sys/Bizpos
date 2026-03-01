import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products_sizes", function (table) {
    table
      .bigInteger("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table
      .integer("size_id")
      .unsigned()
      .references("id")
      .inTable("sizes")
      .onDelete("CASCADE");
    table.primary(["product_id", "size_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("products_sizes");
}
