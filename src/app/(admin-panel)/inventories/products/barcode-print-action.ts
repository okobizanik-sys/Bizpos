"use server";

import prisma from "@/db/prisma";

export interface StockForPrint {
  stockId: number;
  barcode: string;
  productName: string;
  sku: string;
  colorName: string;
  sizeName: string;
  selling_price: number;
}

export async function getStocksForPrint(): Promise<StockForPrint[]> {
  const rows = await prisma.$queryRawUnsafe<any[]>(`
    SELECT stocks.id as stockId, stocks.barcode, products.name as productName, products.sku, products.selling_price, COALESCE(colors.name, '-') as colorName, COALESCE(sizes.name, '-') as sizeName
    FROM stocks
    LEFT JOIN products ON stocks.product_id = products.id
    LEFT JOIN colors ON stocks.color_id = colors.id
    LEFT JOIN sizes ON stocks.size_id = sizes.id
    WHERE stocks.condition = 'new'
    ORDER BY products.name ASC
  `);

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
