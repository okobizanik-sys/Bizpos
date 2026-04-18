"use server";

import {
  StockFilter,
  StockSummary,
} from "@/app/(admin-panel)/inventories/stock-list/page";
import db from "@/db/database";
import { logger } from "@/lib/winston";

function applyNullableWhere(query: any, column: string, value: unknown) {
  if (value === null || value === undefined || value === "") {
    query.whereNull(column);
  } else {
    query.where(column, value);
  }
}

function qualifyDistinctColumns(columns?: string[]) {
  return columns?.map((column) =>
    column.includes(".") ? column : `stocks.${column}`
  );
}

export async function createStock(
  data: {
    product_id: number;
    branch_id: number;
    barcode: string;
    color_id: number;
    size_id: number;
    cost: number;
    quantity: number;
    condition?: string;
    product_date?: string | null;
    shelf_life?: number | null;
    expire_date?: string | null;
    supplier_name?: string | null;
  },
  trx?: any
) {
  const dbs = trx || db;

  // Match by stock batch so different suppliers remain separate rows.
  const existingStock = await dbs("stocks")
    .where({
      product_id: data.product_id,
      branch_id: data.branch_id,
      barcode: data.barcode,
      condition: data.condition || "new",
    })
    .modify((query: any) => {
      applyNullableWhere(query, "color_id", data.color_id);
      applyNullableWhere(query, "size_id", data.size_id);
      applyNullableWhere(query, "supplier_name", data.supplier_name);
      applyNullableWhere(query, "product_date", data.product_date);
      applyNullableWhere(query, "shelf_life", data.shelf_life);
      applyNullableWhere(query, "expire_date", data.expire_date);
    })
    .first();

  if (existingStock) {
    // Compute new average cost
    const newTotalQuantity = existingStock.quantity + data.quantity;
    const newAverageCost =
      (existingStock.cost * existingStock.quantity +
        data.cost * data.quantity) /
      newTotalQuantity;

    // Update the existing stock entry with new cost & quantity
    await dbs("stocks")
      .where({ id: existingStock.id })
      .update({
        cost: Math.round(newAverageCost),
        quantity: newTotalQuantity,
        product_date: data.product_date || null,
        shelf_life: data.shelf_life ?? null,
        expire_date: data.expire_date || null,
        supplier_name: data.supplier_name || null,
        updated_at: new Date(),
      });

    return {
      message: `Stock updated: new quantity ${newTotalQuantity}, new cost ${newAverageCost}`,
    };
  }

  // Insert new stock entry if barcode does not exist
  await dbs("stocks").insert({
    product_id: data.product_id,
    branch_id: data.branch_id,
    barcode: data.barcode,
    color_id: data.color_id,
    size_id: data.size_id,
    cost: data.cost,
    quantity: data.quantity,
    condition: data.condition || "new",
    product_date: data.product_date || null,
    shelf_life: data.shelf_life ?? null,
    expire_date: data.expire_date || null,
    supplier_name: data.supplier_name || null,
    created_at: new Date(),
  });

  return { message: "New stock entry added successfully." };
}

export async function createStockHistory(
  data: {
    product_id: bigint;
    barcode: string;
    variant: string;
    quantity: number;
    cost_per_item: number;
    paid_amount?: number | null;
    due_amount?: number | null;
    product_date?: string | null;
    shelf_life?: number | null;
    expire_date?: string | null;
    supplier_name?: string | null;
  },
  trx?: any
) {
  const dbs = trx || db;
  const [insertResult] = await dbs("stock_histories").insert(data);
  const lastInsertId = insertResult;

  const [stockHistory] = await db("stocks").where({ id: lastInsertId });
  return stockHistory;
}

export async function getStockHistories(params: {
  where?: { created_at?: { gte: Date; lte: Date } };
}) {
  const query = db("stock_histories")
    .select(
      "stock_histories.*",
      "products.name as productName",
      "products.sku as productSku",
      "categories.name as categoryName"
    )
    .leftJoin("products", "stock_histories.product_id", "products.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .orderBy("created_at", "desc");

  // Handle date filtering based on the createdAt field
  if (params.where?.created_at) {
    query.whereBetween("stock_histories.created_at", [
      params.where.created_at.gte,
      params.where.created_at.lte,
    ]);
  }

  const stockHistory = await query;
  logger.info(`Stock history: ${stockHistory}`);
  return stockHistory;
}

export async function getStockHistoriesWithPagination(params: {
  where?: { created_at?: { gte: Date; lte: Date } };
}) {
  const query = db("stock_histories")
    .select(
      "stock_histories.*",
      "products.name as productName",
      "products.sku as productSku",
      "categories.name as categoryName"
    )
    .leftJoin("products", "stock_histories.product_id", "products.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .orderBy("created_at", "desc");

  // Handle date filtering based on the createdAt field
  if (params.where?.created_at) {
    query.whereBetween("stock_histories.created_at", [
      params.where.created_at.gte,
      params.where.created_at.lte,
    ]);
  }

  const stockHistory = await query;
  logger.info(`Stock history: ${stockHistory}`);
  return stockHistory;
}

export async function getStocksByProduct(params: {
  where: { branchId: number };
  filters?: StockFilter;
  page?: number;
  per_page?: number;
}) {
  // const { page = 1, per_page = 10 } = params;
  // const offset = (page - 1) * per_page;

  return (
    db("stocks")
      .where("stocks.condition", "new")
      .leftJoin("products", "stocks.product_id", "products.id")
      .leftJoin("branches", "stocks.branch_id", "branches.id")
      .leftJoin("categories", "products.category_id", "categories.id")
      .leftJoin("images", "products.image_id", "images.id")
      .leftJoin("colors", "stocks.color_id", "colors.id")
      .leftJoin("sizes", "stocks.size_id", "sizes.id")
      .where("stocks.branch_id", params.where.branchId)
      .modify((query) => {
        if (params.filters?.search) {
          query.where("products.name", "like", `%${params.filters.search}%`);
        }
      })
      // .limit(per_page)
      // .offset(offset)
      .select(
        "stocks.*",
        "products.id as productId",
        "branches.id as branchId",
        "branches.name as branchName",
        "products.name",
        "products.sku",
        "products.selling_price",
        "categories.name as categoryName",
        "colors.name as colorName",
        "sizes.name as sizeName",
        "images.url"
        // db.raw("COUNT(DISTINCT stocks.id) as stockQuantity")
      )
  );
}

export async function getStocksByProductWithPagination(params: {
  where: { branchId: number };
  filters?: StockFilter;
  page?: number;
  per_page?: number;
}) {
  const { page = 1, per_page = 10 } = params;
  const offset = (page - 1) * per_page;

  return db("stocks")
    .where("stocks.condition", "new")
    .leftJoin("products", "stocks.product_id", "products.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .leftJoin("images", "products.image_id", "images.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .where("stocks.branch_id", params.where.branchId)
    .modify((query) => {
      if (params.filters?.search) {
        query.where("products.name", "like", `%${params.filters.search}%`);
      }
    })
    .limit(per_page)
    .offset(offset)
    .select(
      "stocks.*",
      "products.id as productId",
      "branches.id as branchId",
      "branches.name as branchName",
      "products.name",
      "products.sku",
      "products.selling_price",
      "categories.name as categoryName",
      "colors.name as colorName",
      "sizes.name as sizeName",
      "images.url"
      // db.raw("COUNT(DISTINCT stocks.id) as stockQuantity")
    );
}

export async function getStocks(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  const stocksQuery = db("stocks")
    .where({ ...params.where, condition: "new" })
    .leftJoin("products", "stocks.product_id", "products.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .select(
      "stocks.*",
      "products.id as productId",
      "products.name",
      "products.sku",
      "products.selling_price",
      "products.description",
      "colors.id as colorId",
      "colors.name as colorName",
      "sizes.id as sizeId",
      "sizes.name as sizeName",
      "branches.name as branchName",
      "branches.id as branchId",
      "categories.name as categoryName"
    )
    .groupBy("stocks.barcode");

  const distinctColumns = qualifyDistinctColumns(params.distinct);
  if (distinctColumns) {
    stocksQuery.distinct(distinctColumns);
  }

  const stocks = await stocksQuery;
  return stocks;
}

export async function getStocksWithPagination(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  const stocksQuery = db("stocks")
    .where({ ...params.where, condition: "new" })
    .leftJoin("products", "stocks.product_id", "products.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .select(
      "stocks.*",
      "products.id as productId",
      "products.name",
      "products.sku",
      "products.selling_price",
      "products.description",
      "colors.id as colorId",
      "colors.name as colorName",
      "sizes.id as sizeId",
      "sizes.name as sizeName",
      "branches.name as branchName",
      "branches.id as branchId",
      "categories.name as categoryName"
    )
    .groupBy("stocks.barcode");

  const distinctColumns = qualifyDistinctColumns(params.distinct);
  if (distinctColumns) {
    stocksQuery.distinct(distinctColumns);
  }

  const stocks = await stocksQuery;
  return stocks;
}

export async function getDamagedStocks(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  const stocksQuery = db("stocks")
    .where({ ...params.where, condition: "damaged" })
    .leftJoin("products", "stocks.product_id", "products.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .select(
      "stocks.*",
      "products.id as productId",
      "products.name",
      "products.sku",
      "products.selling_price",
      "products.description",
      "colors.id as colorId",
      "colors.name as colorName",
      "sizes.id as sizeId",
      "sizes.name as sizeName",
      "branches.name as branchName",
      "branches.id as branchId",
      "categories.name as categoryName"
      // db.raw("COUNT(stocks.barcode) as quantity")
    )
    .groupBy("stocks.barcode")
    .orderBy("created_at", "desc");

  const distinctColumns = qualifyDistinctColumns(params.distinct);
  if (distinctColumns) {
    stocksQuery.distinct(distinctColumns);
  }

  const stocks = await stocksQuery;
  return stocks;
}

export async function getDamagedStocksWithPagination(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  const stocksQuery = db("stocks")
    .where({ ...params.where, condition: "damaged" })
    .leftJoin("products", "stocks.product_id", "products.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .select(
      "stocks.*",
      "products.id as productId",
      "products.name",
      "products.sku",
      "products.selling_price",
      "products.description",
      "colors.id as colorId",
      "colors.name as colorName",
      "sizes.id as sizeId",
      "sizes.name as sizeName",
      "branches.name as branchName",
      "branches.id as branchId",
      "categories.name as categoryName"
      // db.raw("COUNT(stocks.barcode) as quantity")
    )
    .groupBy("stocks.barcode")
    .orderBy("created_at", "desc");

  const distinctColumns = qualifyDistinctColumns(params.distinct);
  if (distinctColumns) {
    stocksQuery.distinct(distinctColumns);
  }

  const stocks = await stocksQuery;
  return stocks;
}

export async function getStocksCount(params: {
  where: { [key: string]: any }; // Adjust according to your filtering needs
}): Promise<number> {
  const stock = await db("stocks")
    .sum<{ total_quantity?: number | string }[]>("quantity as total_quantity")
    .where(params.where)
    .first();

  return stock?.total_quantity ? Number(stock.total_quantity) : 0;
}

export async function getTotalStockSummary(): Promise<StockSummary> {
  const result = await db("stocks")
    .leftJoin("products", "stocks.product_id", "products.id")
    .select(
      db.raw("SUM(stocks.quantity) as total_quantity"),
      db.raw("SUM(stocks.quantity * stocks.cost) as total_stock_value"),
      db.raw(
        "SUM(stocks.quantity * products.selling_price) as total_sell_value"
      )
    )
    .where({ condition: "new" })
    .first();

  return {
    totalQuantity: result?.total_quantity || 0,
    totalStockValue: Math.round(result?.total_stock_value) || 0,
    totalSellValue: Math.round(result?.total_sell_value) || 0,
  };
}

export async function decreaseStock(
  barcode: string,
  quantity: number,
  trx?: any
) {
  const dbs = trx || db;
  const stockItem = await dbs("stocks").where({ barcode }).first();

  if (!stockItem || stockItem.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  await dbs("stocks").where({ barcode }).decrement("quantity", quantity);
}

export async function increaseStock(
  productId: number,
  branchId: number,
  quantity: number,
  cost: number,
  barcode: string,
  colorId?: number,
  sizeId?: number,
  condition?: string,
  trx?: any
) {
  const dbs = trx || db;

  // const existingStock = await dbs("stocks")
  //   .where({
  //     // product_id: productId,
  //     branch_id: branchId,
  //     // color_id: colorId,
  //     // size_id: sizeId,
  //     barcode,
  //   })
  //   .first();

  // if (existingStock) {
  //   await dbs("stocks")
  //     .where({ id: existingStock.id })
  //     .increment("quantity", quantity);
  // } else {
  //   await dbs("stocks").insert({
  //     product_id: productId,
  //     branch_id: branchId,
  //     color_id: colorId,
  //     size_id: sizeId,
  //     quantity,
  //     cost,
  //     barcode,
  //     condition: condition,
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   });
  // }

  const increasedStock = await dbs("stocks").insert({
    product_id: productId,
    branch_id: branchId,
    color_id: colorId,
    size_id: sizeId,
    quantity,
    cost,
    barcode,
    condition: condition,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return increasedStock;
}

export async function updateStockCondition(itemIds: bigint[]) {
  if (itemIds.length === 0) {
    throw new Error("No items provided to update");
  }

  const itemIdsAsString = itemIds.map((id) => id.toString());

  await db("stocks").whereIn("id", itemIdsAsString).update({
    condition: "damaged",
    updated_at: new Date(),
  });
}

export async function updateStockBranchId(
  challanId: bigint,
  toBranchId: number,
  quantity: number,
  barcode: string,
  trx?: any
) {
  const dbs = db || trx;

  // Fetch existing stock records sorted by the oldest update first
  const stockEntries = await dbs("stocks")
    .where("barcode", barcode)
    .andWhere("branch_id", "<>", toBranchId)
    .orderBy("updated_at", "asc")
    .select("id", "quantity");

  let remainingQuantity = quantity;

  for (const stock of stockEntries) {
    if (remainingQuantity <= 0) break;

    const updateQty = Math.min(stock.quantity, remainingQuantity);
    remainingQuantity -= updateQty;

    // Reduce stock from the old branch
    await dbs("stocks")
      .where("id", stock.id)
      .update({
        quantity: stock.quantity - updateQty,
        updated_at: new Date(),
      });

    // Check if stock already exists in the destination branch
    const existingStock = await dbs("stocks")
      .where({ barcode, branch_id: toBranchId })
      .first();

    if (existingStock) {
      // Increase quantity at the destination branch
      await dbs("stocks")
        .where("id", existingStock.id)
        .update({
          quantity: existingStock.quantity + updateQty,
          updated_at: new Date(),
        });
    } else {
      // Insert new stock entry if none exists
      await dbs("stocks").insert({
        barcode,
        branch_id: toBranchId,
        quantity: updateQty,
        updated_at: new Date(),
        created_at: new Date(),
      });
    }
  }
}

export async function updateStockQuantity(
  quantity: number,
  barcode: string,
  trx?: any
) {
  const dbs = db || trx;

  await dbs("stocks").where("stocks.barcode", barcode).update({
    quantity: quantity,
    updated_at: new Date(),
  });
}
