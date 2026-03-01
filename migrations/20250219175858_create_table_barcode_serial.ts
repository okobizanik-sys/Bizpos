import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("barcode_serials", function (table) {
    table.increments("id").primary().unique();
    table.bigInteger("serial").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("barcode_serials");
}
