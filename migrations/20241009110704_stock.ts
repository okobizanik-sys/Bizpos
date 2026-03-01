import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("stocks", function (table) {
    table.bigIncrements("id").primary();
    table
      .bigInteger("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table
      .integer("branch_id")
      .unsigned()
      .notNullable()
      .defaultTo(1)
      .references("id")
      .inTable("branches");
    table.string("barcode").notNullable();
    table.integer("color_id").unsigned().references("id").inTable("colors");
    table.integer("size_id").unsigned().references("id").inTable("sizes");
    table.float("cost").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("stocks");
}
