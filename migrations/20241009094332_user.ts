import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table
      .increments("id") // Use auto-incrementing integer as the primary key
      .primary()
      .notNullable()
      .unique();

    table.string("name").nullable(); // Equivalent to Prisma's String?
    table.string("email").notNullable().unique(); // Prisma's email @unique
    table.string("password").nullable(); // Prisma's password field
    table.timestamp("email_verified").nullable(); // Prisma's emailVerified @map("email_verified")

    table
      .enu("role", ["ADMIN", "STAFF"], { useNative: true, enumName: "role" })
      .notNullable()
      .defaultTo("STAFF"); // Prisma's role with default

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now()); // Prisma's createdAt @default(now()) @map("created_at")
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now()); // Prisma's updatedAt @updatedAt @map("updated_at")
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
