import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sessions", function (table) {
    table.string("session_token").unique().notNullable();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("expires").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("sessions");
}
