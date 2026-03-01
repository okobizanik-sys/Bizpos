import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_items", function (table) {
    table.bigIncrements("id").primary();
    table
      .bigInteger("order_id")
      .unsigned()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .bigInteger("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.integer("quantity").notNullable();
    table.float("price").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("order_items");
}
