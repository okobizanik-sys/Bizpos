import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("orders", (table) => {
    table.integer("due_amount").nullable();
    table.integer("paid_amount").nullable();
    table.string("payment_method").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("orders", (table) => {
    table.dropColumn("due_amount");
    table.dropColumn("paid_amount");
    table.dropColumn("payment_method");
  });
}
