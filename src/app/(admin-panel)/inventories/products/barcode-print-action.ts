"use server";

import db from "@/db/database";

export interface StockForPrint {
  stockId: number;
  barcode: string;
  productName: string;
  sku: string;
  colorName: string;
  sizeName: string;
  selling_price: number;
}

/**
 * Returns every distinct stock entry (stocks.barcode) with product info.
 * This is the single source of truth for barcodes — the same barcode used
 * in POS, orders, stock transfers, and challan.
 */
export async function getStocksForPrint(): Promise<StockForPrint[]> {
  const rows = await db("stocks")
    .where("stocks.condition", "new")
    .leftJoin("products", "stocks.product_id", "products.id")
    .leftJoin("colors", "stocks.color_id", "colors.id")
    .leftJoin("sizes", "stocks.size_id", "sizes.id")
    .select(
      "stocks.id as stockId",
      "stocks.barcode",
      "products.name as productName",
      "products.sku",
      "products.selling_price",
      db.raw("COALESCE(colors.name, '-') as colorName"),
      db.raw("COALESCE(sizes.name, '-') as sizeName"),
    )
    .orderBy("products.name", "asc");

  return rows.map((r) => ({
    stockId: Number(r.stockId),
    barcode: String(r.barcode ?? ""),
    productName: String(r.productName ?? ""),
    sku: String(r.sku ?? ""),
    colorName: String(r.colorName ?? "-"),
    sizeName: String(r.sizeName ?? "-"),
    selling_price: Number(r.selling_price ?? 0),
  }));
}
