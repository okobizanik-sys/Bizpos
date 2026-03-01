import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("branches", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("address").notNullable();
    table.string("phone").notNullable();
    table.boolean("root").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("braches");
}
