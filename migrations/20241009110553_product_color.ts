import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products_colors", function (table) {
    table
      .bigInteger("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table
      .integer("color_id")
      .unsigned()
      .references("id")
      .inTable("colors")
      .onDelete("CASCADE");
    table.primary(["product_id", "color_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("products_colors");
}
