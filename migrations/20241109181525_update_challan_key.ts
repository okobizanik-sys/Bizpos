import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("challans", (table) => {
    table.string("challan_no");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("challans", (table) => {
    table.dropColumn("challan_no");
  });
}
