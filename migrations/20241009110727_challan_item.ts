import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("challan_items", function (table) {
    table.bigIncrements("id").primary();
    table
      .bigInteger("challan_id")
      .unsigned()
      .references("id")
      .inTable("challans")
      .onDelete("CASCADE");
    table
      .bigInteger("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.string("barcode").notNullable();
    table.integer("quantity").notNullable();
    table.string("variant");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("challan_items");
}
