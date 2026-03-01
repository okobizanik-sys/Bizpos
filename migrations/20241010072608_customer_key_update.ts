import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("customers", function (table) {
    table.string("customer").notNullable();
    table.integer("group_id").unsigned().references("id").inTable("groups");
    table
      .integer("membership_id")
      .unsigned()
      .references("id")
      .inTable("memberships");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("customers", function (table) {
    // Remove foreign key columns
    table.dropColumn("customer");
    table.dropColumn("group_id");
    table.dropColumn("membership_id");
  });
}
