import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const suppliersHasEmail = await knex.schema.hasColumn("suppliers", "email");
  const stockHistoriesHasSupplierName = await knex.schema.hasColumn(
    "stock_histories",
    "supplier_name"
  );
  const stockHistoriesHasProductDate = await knex.schema.hasColumn(
    "stock_histories",
    "product_date"
  );
  const stockHistoriesHasShelfLife = await knex.schema.hasColumn(
    "stock_histories",
    "shelf_life"
  );
  const stockHistoriesHasExpireDate = await knex.schema.hasColumn(
    "stock_histories",
    "expire_date"
  );
  const stockHistoriesHasPaidAmount = await knex.schema.hasColumn(
    "stock_histories",
    "paid_amount"
  );
  const stockHistoriesHasDueAmount = await knex.schema.hasColumn(
    "stock_histories",
    "due_amount"
  );

  if (!suppliersHasEmail) {
    await knex.schema.alterTable("suppliers", function (table) {
      table.string("email").nullable();
    });
  }

  if (
    !stockHistoriesHasSupplierName ||
    !stockHistoriesHasProductDate ||
    !stockHistoriesHasShelfLife ||
    !stockHistoriesHasExpireDate ||
    !stockHistoriesHasPaidAmount ||
    !stockHistoriesHasDueAmount
  ) {
    await knex.schema.alterTable("stock_histories", function (table) {
      if (!stockHistoriesHasSupplierName) table.string("supplier_name").nullable();
      if (!stockHistoriesHasProductDate) table.date("product_date").nullable();
      if (!stockHistoriesHasShelfLife) table.integer("shelf_life").nullable();
      if (!stockHistoriesHasExpireDate) table.date("expire_date").nullable();
      if (!stockHistoriesHasPaidAmount) table.float("paid_amount").nullable();
      if (!stockHistoriesHasDueAmount) table.float("due_amount").nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const suppliersHasEmail = await knex.schema.hasColumn("suppliers", "email");
  const stockHistoriesHasSupplierName = await knex.schema.hasColumn(
    "stock_histories",
    "supplier_name"
  );
  const stockHistoriesHasProductDate = await knex.schema.hasColumn(
    "stock_histories",
    "product_date"
  );
  const stockHistoriesHasShelfLife = await knex.schema.hasColumn(
    "stock_histories",
    "shelf_life"
  );
  const stockHistoriesHasExpireDate = await knex.schema.hasColumn(
    "stock_histories",
    "expire_date"
  );
  const stockHistoriesHasPaidAmount = await knex.schema.hasColumn(
    "stock_histories",
    "paid_amount"
  );
  const stockHistoriesHasDueAmount = await knex.schema.hasColumn(
    "stock_histories",
    "due_amount"
  );

  if (
    stockHistoriesHasSupplierName ||
    stockHistoriesHasProductDate ||
    stockHistoriesHasShelfLife ||
    stockHistoriesHasExpireDate ||
    stockHistoriesHasPaidAmount ||
    stockHistoriesHasDueAmount
  ) {
    await knex.schema.alterTable("stock_histories", function (table) {
      if (stockHistoriesHasSupplierName) table.dropColumn("supplier_name");
      if (stockHistoriesHasProductDate) table.dropColumn("product_date");
      if (stockHistoriesHasShelfLife) table.dropColumn("shelf_life");
      if (stockHistoriesHasExpireDate) table.dropColumn("expire_date");
      if (stockHistoriesHasPaidAmount) table.dropColumn("paid_amount");
      if (stockHistoriesHasDueAmount) table.dropColumn("due_amount");
    });
  }

  if (suppliersHasEmail) {
    await knex.schema.alterTable("suppliers", function (table) {
      table.dropColumn("email");
    });
  }
}
