import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sales", function (table) {
    table.bigIncrements("id").primary();
    table
      .bigInteger("order_id")
      .unsigned()
      .unique()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .integer("branch_id")
      .unsigned()
      .references("id")
      .inTable("branches")
      .onDelete("CASCADE");
    table.timestamp("order_date").defaultTo(knex.fn.now());
    table
      .integer("customer_id")
      .unsigned()
      .references("id")
      .inTable("customers")
      .onDelete("CASCADE");
    table.string("customer_phone");
    table.float("total_amount").notNullable();
    table.float("cost_of_goods_sold");
    table.float("vat");
    table.boolean("action");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("sales");
}
