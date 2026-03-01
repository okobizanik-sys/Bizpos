import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("customers", function (table) {
    table.increments("id").primary();
    table.string("product_id").notNullable();
    table.string("address").notNullable();
    table.string("phone").notNullable();
    table.timestamp("issue_date").defaultTo(knex.fn.now());
    table.timestamp("expire_date");
    table.boolean("action");
    
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("customers");
}
