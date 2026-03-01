import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("products", function (table) {
    // Adding category_id column as a foreign key
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("SET NULL"); // Set to NULL if the category is deleted

    // Adding brand_id column as a foreign key
    table
      .integer("brand_id")
      .unsigned()
      .references("id")
      .inTable("brands")
      .onDelete("SET NULL"); // Set to NULL if the brand is deleted

    // Adding image_id column as a foreign key
    table
      .integer("image_id")
      .unsigned()
      .references("id")
      .inTable("images")
      .onDelete("SET NULL"); // Set to NULL if the image is deleted
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("products", function (table) {
    // Remove foreign key columns
    table.dropColumn("category_id");
    table.dropColumn("brand_id");
    table.dropColumn("image_id");
  });
}
