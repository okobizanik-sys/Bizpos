import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_items", (table) => {
    table.integer("color_id").unsigned().nullable().references("id").inTable("colors").onDelete("CASCADE");
    table.integer("size_id").unsigned().nullable().references("id").inTable("sizes").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_items", (table) => {
    table.dropColumn("color_id");
    table.dropColumn("size_id");
  });
}
