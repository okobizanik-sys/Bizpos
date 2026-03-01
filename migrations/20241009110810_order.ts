import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", function (table) {
    table.bigIncrements("id").primary();
    table.string("order_id").unique().notNullable();
    table.timestamp("date").defaultTo(knex.fn.now());
    table.float("total").notNullable();
    table
      .enu("status", ["COMPLETED", "EXCHANGED", "RETURN"])
      .defaultTo("COMPLETED");
    table
      .integer("customer_id")
      .unsigned()
      .references("id")
      .inTable("customers")
      .onDelete("CASCADE");
    table.timestamps(true, true);
    table.boolean("action");
    table
      .integer("branch_id")
      .unsigned()
      .references("id")
      .inTable("branches")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("orders");
}
