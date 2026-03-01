import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.string("comment").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("comment");
  });
}
