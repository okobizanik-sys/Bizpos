import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("customers", (table) => {
    table.enu("fraud", ["true", "false"]).defaultTo("false");

    table.string("remarks", 255).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("customers", (table) => {
    table.dropColumn("fraud");
    table.dropColumn("remarks");
  });
}
