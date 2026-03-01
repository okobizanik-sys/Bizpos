"use server";

import db from "@/db/database";
import { logger } from "../lib/winston";
import { ProductFilter } from "@/app/(admin-panel)/inventories/products/page";

// Get products with optional parameters
// export async function getProducts(params: {
//   skip?: number;
//   take?: number;
//   orderBy?: { [key: string]: "asc" | "desc" }[];
//   where?: ProductFilter;
// }) {
//   const { filter_global, filter } = params.where || {};

//   const query = db("products")
//     .select(
//       "products.*",
//       "categories.name as categoryName",
//       "brands.name as brandName",
//       "images.url as imageUrl"
//     )
//     .leftJoin("categories", "products.category_id", "categories.id")
//     .leftJoin("brands", "products.brand_id", "brands.id")
//     .leftJoin("images", "products.image_id", "images.id")
//     .orderBy("created_at", "desc");

//   if (filter_global) {
//     query.where(function () {
//       this.where("products.id", "LIKE", `%${filter_global}%`)
//         .orWhere("products.name", "LIKE", `%${filter_global}%`)
//         .orWhere("products.sku", "LIKE", `%${filter_global}%`);
//     });
//   }

//   if (filter) {
//     query.andWhere("categories.name", filter);
//   }

//   // Apply ordering if present
//   if (params.orderBy) {
//     params.orderBy.forEach((order) => {
//       Object.entries(order).forEach(([key, value]) => {
//         query.orderBy(key, value);
//       });
//     });
//   }

//   // Apply pagination if present
//   if (params.skip) {
//     query.offset(params.skip);
//   }

//   if (params.take) {
//     query.limit(params.take);
//   }

//   const products = await query;
//   return products;
// }

export async function getProducts(params: {
  skip?: number;
  take?: number;
  orderBy?: { [key: string]: "asc" | "desc" }[];
  where?: ProductFilter;
}) {
  const { filter_global, filter } = params.where || {};

  // Base query for products
  const query = db("products")
    .select(
      "products.*",
      "categories.name as categoryName",
      "brands.name as brandName",
      "images.url as imageUrl"
    )
    .leftJoin("categories", "products.category_id", "categories.id")
    .leftJoin("brands", "products.brand_id", "brands.id")
    .leftJoin("images", "products.image_id", "images.id")
    .orderBy("products.created_at", "desc");

  // Apply filters
  if (filter_global) {
    query.where(function () {
      this.where("products.id", "LIKE", `%${filter_global}%`)
        .orWhere("products.name", "LIKE", `%${filter_global}%`)
        .orWhere("products.sku", "LIKE", `%${filter_global}%`);
    });
  }

  if (filter) {
    query.andWhere("categories.name", filter);
  }

  // Apply ordering if present
  if (params.orderBy) {
    params.orderBy.forEach((order) => {
      Object.entries(order).forEach(([key, value]) => {
        query.orderBy(key, value);
      });
    });
  }

  // Clone the query to use for counting
  const countQuery = db("products")
    .count("* as total")
    .leftJoin("categories", "products.category_id", "categories.id");

  if (filter_global) {
    countQuery.where(function () {
      this.where("products.id", "LIKE", `%${filter_global}%`)
        .orWhere("products.name", "LIKE", `%${filter_global}%`)
        .orWhere("products.sku", "LIKE", `%${filter_global}%`);
    });
  }

  if (filter) {
    countQuery.andWhere("categories.name", filter);
  }

  // Fetch total count
  const [{ total }] = await countQuery;

  // Apply pagination
  if (params.skip) {
    query.offset(params.skip);
  }

  if (params.take) {
    query.limit(params.take);
  }

  // Fetch products
  const products = await query;

  return { products, total: Number(total) };
}

// db.raw("COUNT(stocks.barcode) as stockQuantity")
export async function getProduct(params: any) {
  const query = db("products")
    .select(
      "products.*",
      "categories.name as categoryName",
      "brands.name as brandName",
      "images.url as imageUrl",
      "stocks.barcode",
      "stocks.condition",
      "stocks.product_id",
      "stocks.quantity",
      // db.raw("COUNT(stocks.id) OVER() as quantity"),
      "sizes.name as sizeName",
      "colors.name as colorName",
      "branches.name as branchName"
    )
    .leftJoin("categories", "products.category_id", "categories.id")
    .leftJoin("stocks", "stocks.product_id", "products.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("brands", "products.brand_id", "brands.id")
    .leftJoin("images", "products.image_id", "images.id")
    .where("products.id", params.where.id)
    .andWhere("stocks.condition", "new")
    .groupBy("stocks.barcode");

  const rows = await query;
  if (!rows || rows.length === 0) {
    return null;
  }

  const product = {
    ...rows[0],
    stocks: rows.map((row) => ({
      barcode: row.barcode,
      quantity: row.quantity,
      size: { name: row.sizeName },
      color: { name: row.colorName },
      branch: { name: row.branchName },
    })),
  };

  return product;
}

export async function getSelectedProduct(params: any) {
  const query = db("products")
    .select(
      "products.*",
      "categories.name as categoryName",
      "brands.name as brandName",
      "images.url as imageUrl",
      "stocks.barcode",
      "stocks.condition",
      "stocks.product_id",
      db.raw("COUNT(stocks.id) OVER() as quantity"),
      "sizes.name as sizeName",
      "colors.name as colorName",
      "branches.name as branchName"
    )
    .leftJoin("categories", "products.category_id", "categories.id")
    .leftJoin("stocks", "stocks.product_id", "products.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("brands", "products.brand_id", "brands.id")
    .leftJoin("images", "products.image_id", "images.id")
    .where("products.id", params.where.id)
    .groupBy(
      "stocks.id",
      "stocks.product_id",
      "stocks.barcode",
      "stocks.branch_id",
      "stocks.color_id",
      "stocks.size_id"
    );

  const rows = await query;
  if (!rows || rows.length === 0) {
    return null;
  }

  const product = {
    ...rows[0],
    stocks: rows.map((row) => ({
      barcode: row.barcode,
      // quantity: row.quantity,
      size: { name: row.sizeName },
      color: { name: row.colorName },
      branch: { name: row.branchName },
    })),
  };

  return product;
}

export async function createProduct(data: any) {
  const [insertResult] = await db("products").insert(data);
  const lastInsertId = insertResult;

  const [product] = await db("products").where({ id: lastInsertId });

  logger.info(`Product created successfully: ${product.id}`);
  return product;
}

export async function updateProduct(
  params: {
    where: { [key: string]: any };
    data: {
      name?: string;
      sku?: string;
      selling_price?: number;
      description?: string;
      category_id?: number;
      brand_id?: number | null;
      image_id?: number;
    };
  },
  trx?: any
) {
  const dbs = db || trx;

  await dbs("products").where(params.where).update(params.data);

  const updatedProduct = await dbs("products").where(params.where).first();
  if (!updatedProduct) throw new Error("Product not found after update");

  logger.info(`Product updated successfully: ${updatedProduct.id}`);

  return updatedProduct;
}

export async function deleteProduct(where: { [key: string]: any }) {
  const product = await db("products").where(where).first();

  if (!product) throw new Error("Product not found");

  await db("products").where(where).del();

  logger.info(`Product deleted successfully: ${product.id}`);

  return product;
}
