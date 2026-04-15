import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasPaymentMethod = await knex.schema.hasColumn(
    "stock_histories",
    "payment_method"
  );

  if (!hasPaymentMethod) {
    await knex.schema.alterTable("stock_histories", function (table) {
      table.string("payment_method").nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasPaymentMethod = await knex.schema.hasColumn(
    "stock_histories",
    "payment_method"
  );

  if (hasPaymentMethod) {
    await knex.schema.alterTable("stock_histories", function (table) {
      table.dropColumn("payment_method");
    });
  }
}

