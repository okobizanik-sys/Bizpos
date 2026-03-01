import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("challans", function (table) {
    table.bigIncrements("id").primary();
    table
      .integer("from_branch_id")
      .unsigned()
      .references("id")
      .inTable("branches")
      .onDelete("CASCADE");
    table
      .integer("to_branch_id")
      .unsigned()
      .references("id")
      .inTable("branches")
      .onDelete("CASCADE");
    table.enu("status", ["PENDING", "RECEIVED"]).defaultTo("PENDING");
    table.integer("quantity").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("challans");
}
