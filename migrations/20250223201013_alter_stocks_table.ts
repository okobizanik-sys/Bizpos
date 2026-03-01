import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
//   return knex.schema.alterTable("stocks", function (table) {
//     table.text("return_privacy_policy").alter();
//   });
}

export async function down(knex: Knex): Promise<void> {
//   return knex.schema.alterTable("settings_data", function (table) {
//     table.string("return_privacy_policy", 255).alter();
//   });
}
