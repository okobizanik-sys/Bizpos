import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // return knex.schema.table("order_items", function (table) {
  //   table
  //     .integer("color_id")
  //     .unsigned()
  //     .references("id")
  //     .inTable("color")
  //     .onDelete("CASCADE")
  //     .onUpdate("CASCADE");

  //   table
  //     .integer("size_id")
  //     .unsigned()
  //     .references("id")
  //     .inTable("size")
  //     .onDelete("CASCADE")
  //     .onUpdate("CASCADE");
  // });
}

export async function down(knex: Knex): Promise<void> {
  // return knex.schema.table("order_items", function (table) {
  //   // Remove the foreign key columns
  //   table.dropColumn("color_id");
  //   table.dropColumn("size_id");
  // });
}
