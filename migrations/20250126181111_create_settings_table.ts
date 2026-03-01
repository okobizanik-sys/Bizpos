import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("settings_data", function (table) {
    table.increments("id").primary();
    table.string("return_privacy_policy").nullable();
    table.string("logo_image_url").nullable();
    table.string("login_image_url").nullable();
    table.decimal("vat_rate", 5, 2).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("settings_data");
}
