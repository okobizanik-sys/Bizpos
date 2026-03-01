import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("verification_tokens", function (table) {
    table.string("identifier").notNullable();
    table.string("token").notNullable();
    table.timestamp("expires").notNullable();
    table.primary(["identifier", "token"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("verification_tokens");
}
