import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("stocks", function (table) {
    table.date("product_date").nullable();
    table.integer("shelf_life").nullable();
    table.date("expire_date").nullable();
  });

  await knex.schema.alterTable("stock_histories", function (table) {
    table.date("product_date").nullable();
    table.integer("shelf_life").nullable();
    table.date("expire_date").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("stock_histories", function (table) {
    table.dropColumn("product_date");
    table.dropColumn("shelf_life");
    table.dropColumn("expire_date");
  });

  await knex.schema.alterTable("stocks", function (table) {
    table.dropColumn("product_date");
    table.dropColumn("shelf_life");
    table.dropColumn("expire_date");
  });
}
