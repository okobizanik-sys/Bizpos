import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("accounts", function (table) {
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("type").notNullable();
    table.string("provider").notNullable();
    table.string("provider_account_id").notNullable();
    table.string("refresh_token");
    table.string("access_token");
    table.integer("expires_at");
    table.string("token_type");
    table.string("scope");
    table.string("id_token");
    table.string("session_state");
    table.timestamps(true, true);
    table.primary(["provider", "provider_account_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("accounts");
}
