import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // return knex.schema.createTable("settings", (table) => {
  //   table.increments("id").primary(); // Auto-incrementing primary key
  //   table.text("return_privacy_policy").nullable(); // Return and privacy policy text
  //   table.string("logo_image_url").nullable(); // URL for logo image
  //   table.string("login_image_url").nullable(); // URL for login page image
  //   table.integer("vat_rate").nullable(); // VAT rate as a number
  //   table.timestamps(true, true); // Adds created_at and updated_at timestamps
  // });
}

export async function down(knex: Knex): Promise<void> {
  // return knex.schema.dropTable("settings");
}
