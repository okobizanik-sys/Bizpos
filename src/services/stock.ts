"use server";

import {
  StockFilter,
  StockSummary,
} from "@/app/(admin-panel)/inventories/stock-list/page";
import prisma from "@/db/prisma";
import { logger } from "@/lib/winston";

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
  tx?: any,
) {
  const dbs = tx || prisma;

  const existingStock = await dbs.stocks.findFirst({
    where: {
      product_id: BigInt(data.product_id),
      branch_id: data.branch_id,
      barcode: data.barcode,
      condition: data.condition || "new",
      color_id: data.color_id || null,
      size_id: data.size_id || null,
      supplier_name: data.supplier_name || null,
      product_date: data.product_date ? new Date(data.product_date) : null,
      shelf_life: data.shelf_life ?? null,
      expire_date: data.expire_date ? new Date(data.expire_date) : null,
    },
  });

  if (existingStock) {
    const newTotalQuantity = existingStock.quantity + data.quantity;
    const newAverageCost =
      (existingStock.cost * existingStock.quantity +
        data.cost * data.quantity) /
      newTotalQuantity;

    await dbs.stocks.update({
      where: { id: existingStock.id },
      data: {
        cost: Math.round(newAverageCost),
        quantity: newTotalQuantity,
        product_date: data.product_date ? new Date(data.product_date) : null,
        shelf_life: data.shelf_life ?? null,
        expire_date: data.expire_date ? new Date(data.expire_date) : null,
        supplier_name: data.supplier_name || null,
        updated_at: new Date(),
      },
    });

    return {
      message: `Stock updated: new quantity ${newTotalQuantity}, new cost ${newAverageCost}`,
    };
  }

  await dbs.stocks.create({
    data: {
      product_id: BigInt(data.product_id),
      branch_id: data.branch_id,
      barcode: data.barcode,
      color_id: data.color_id,
      size_id: data.size_id,
      cost: data.cost,
      quantity: data.quantity,
      condition: data.condition || "new",
      product_date: data.product_date ? new Date(data.product_date) : null,
      shelf_life: data.shelf_life ?? null,
      expire_date: data.expire_date ? new Date(data.expire_date) : null,
      supplier_name: data.supplier_name || null,
      created_at: new Date(),
    },
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
  tx?: any,
) {
  const dbs = tx || prisma;
  const historyData: any = { ...data };
  if (data.product_date) historyData.product_date = new Date(data.product_date);
  if (data.expire_date) historyData.expire_date = new Date(data.expire_date);

  const stockHistory = await dbs.stock_histories.create({ data: historyData });
  return stockHistory;
}

export async function getStockHistories(params: {
  where?: { created_at?: { gte: Date; lte: Date } };
}) {
  return getStockHistoriesWithPagination(params);
}

function buildStockHistoryQuery(params: {
  where?: { created_at?: { gte: Date; lte: Date } };
  page?: number;
  per_page?: number;
}) {
  let whereStr = "1=1";
  const queryParams: any[] = [];

  if (params.where?.created_at) {
    whereStr += " AND sh.created_at BETWEEN ? AND ?";
    queryParams.push(params.where.created_at.gte, params.where.created_at.lte);
  }

  const offset =
    params.page && params.per_page ? (params.page - 1) * params.per_page : 0;
  const limitOffsetStr =
    params.page && params.per_page
      ? `LIMIT ${params.per_page} OFFSET ${offset}`
      : "";

  const query = `
    SELECT 
      sh.*,
      p.name as productName,
      p.sku as productSku,
      c.name as categoryName
    FROM stock_histories sh
    LEFT JOIN products p ON sh.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr}
    ORDER BY sh.created_at DESC
    ${limitOffsetStr}
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM stock_histories sh
    LEFT JOIN products p ON sh.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr}
  `;

  return { query, countQuery, queryParams };
}

export async function getStockHistoriesWithPagination(params: {
  where?: { created_at?: { gte: Date; lte: Date } };
  page?: number;
  per_page?: number;
}) {
  const { query, queryParams } = buildStockHistoryQuery(params);
  const stockHistory = await prisma.$queryRawUnsafe<any[]>(
    query,
    ...queryParams,
  );
  logger.info(`Stock history: ${stockHistory}`);
  return stockHistory;
}

export async function getStockHistoriesCount(params: {
  where?: { created_at?: { gte: Date; lte: Date } };
}) {
  const { countQuery, queryParams } = buildStockHistoryQuery(params);
  const result = await prisma.$queryRawUnsafe<any[]>(
    countQuery,
    ...queryParams,
  );
  return Number(result[0]?.total || 0);
}

export async function getStocksByProduct(params: {
  where: { branchId: number };
  filters?: StockFilter;
  page?: number;
  per_page?: number;
}) {
  let whereStr = "s.condition = 'new' AND s.branch_id = ?";
  const queryParams: any[] = [params.where.branchId];

  if (params.filters?.search) {
    whereStr += " AND p.name LIKE ?";
    queryParams.push(`%${params.filters.search}%`);
  }

  let limitOffsetStr = "";
  if (params.per_page) {
    const page = params.page || 1;
    const offset = (page - 1) * params.per_page;
    limitOffsetStr = `LIMIT ${params.per_page} OFFSET ${offset}`;
  }

  const query = `
    SELECT 
      s.*,
      p.id as productId,
      b.id as branchId,
      b.name as branchName,
      p.name,
      p.sku,
      p.selling_price,
      c.name as categoryName,
      col.name as colorName,
      sz.name as sizeName,
      i.url
    FROM stocks s
    LEFT JOIN products p ON s.product_id = p.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN images i ON p.image_id = i.id
    LEFT JOIN colors col ON s.color_id = col.id
    LEFT JOIN sizes sz ON s.size_id = sz.id
    WHERE ${whereStr}
    ${limitOffsetStr}
  `;

  return await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
}

export async function getStocksByProductWithPagination(params: {
  where: { branchId: number };
  filters?: StockFilter;
  page?: number;
  per_page?: number;
}) {
  const { page = 1, per_page = 10 } = params;
  return getStocksByProduct({ ...params, page, per_page });
}

function buildStocksQuery(params: {
  where: { [key: string]: any };
  distinct?: string[];
  condition?: string;
}) {
  let whereStr = `s.condition = '${params.condition || "new"}'`;
  const queryParams: any[] = [];

  for (const [key, value] of Object.entries(params.where)) {
    if (key === "branch_id") {
      whereStr += ` AND s.branch_id = ?`;
    } else if (key === "product_id") {
      whereStr += ` AND s.product_id = ?`;
    } else if (key === "barcode") {
      whereStr += ` AND s.barcode = ?`;
    } else {
      whereStr += ` AND ${key} = ?`;
    }
    queryParams.push(value);
  }

  return { whereStr, queryParams };
}

export async function getStocks(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  const { whereStr, queryParams } = buildStocksQuery({
    where: params.where,
    condition: "new",
  });

  const query = `
    SELECT 
      s.*,
      p.id as productId,
      p.name,
      p.sku,
      p.selling_price,
      p.description,
      col.id as colorId,
      col.name as colorName,
      sz.id as sizeId,
      sz.name as sizeName,
      b.name as branchName,
      b.id as branchId,
      c.name as categoryName
    FROM stocks s
    LEFT JOIN products p ON s.product_id = p.id
    LEFT JOIN colors col ON s.color_id = col.id
    LEFT JOIN sizes sz ON s.size_id = sz.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr}
    GROUP BY s.barcode, s.id, p.id, col.id, sz.id, b.id, c.id
  `;

  return await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
}

export async function getStocksWithPagination(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  return getStocks(params);
}

export async function getDamagedStocks(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  const { whereStr, queryParams } = buildStocksQuery({
    where: params.where,
    condition: "damaged",
  });

  const query = `
    SELECT 
      s.*,
      p.id as productId,
      p.name,
      p.sku,
      p.selling_price,
      p.description,
      col.id as colorId,
      col.name as colorName,
      sz.id as sizeId,
      sz.name as sizeName,
      b.name as branchName,
      b.id as branchId,
      c.name as categoryName
    FROM stocks s
    LEFT JOIN products p ON s.product_id = p.id
    LEFT JOIN colors col ON s.color_id = col.id
    LEFT JOIN sizes sz ON s.size_id = sz.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr}
    GROUP BY s.barcode, s.id, p.id, col.id, sz.id, b.id, c.id
    ORDER BY s.created_at DESC
  `;

  return await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
}

export async function getExpiredStocks(params: {
  where?: { [key: string]: any };
  distinct?: string[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const { whereStr, queryParams } = buildStocksQuery({
    where: params.where || {},
    condition: "new",
  });

  const query = `
    SELECT 
      s.*,
      p.id as productId,
      p.name,
      p.sku,
      p.selling_price,
      p.description,
      col.id as colorId,
      col.name as colorName,
      sz.id as sizeId,
      sz.name as sizeName,
      b.name as branchName,
      b.id as branchId,
      c.name as categoryName
    FROM stocks s
    LEFT JOIN products p ON s.product_id = p.id
    LEFT JOIN colors col ON s.color_id = col.id
    LEFT JOIN sizes sz ON s.size_id = sz.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr}
      AND s.expire_date IS NOT NULL
      AND s.expire_date < ?
    GROUP BY s.barcode, s.id, p.id, col.id, sz.id, b.id, c.id
    ORDER BY s.expire_date ASC
  `;

  return await prisma.$queryRawUnsafe<any[]>(query, ...queryParams, today);
}

export async function getDamagedStocksWithPagination(params: {
  where: { [key: string]: any };
  distinct?: string[];
}) {
  return getDamagedStocks(params);
}

export async function getStocksCount(params: {
  where: { [key: string]: any };
}): Promise<number> {
  const stock = await prisma.stocks.aggregate({
    _sum: { quantity: true },
    where: params.where,
  });

  return Number(stock._sum.quantity || 0);
}

export async function getTotalStockSummary(): Promise<StockSummary> {
  const result = await prisma.$queryRaw<any[]>`
    SELECT 
      SUM(s.quantity) as total_quantity,
      SUM(s.quantity * s.cost) as total_stock_value,
      SUM(s.quantity * p.selling_price) as total_sell_value
    FROM stocks s
    LEFT JOIN products p ON s.product_id = p.id
    WHERE s.condition = 'new'
  `;

  return {
    totalQuantity: Number(result[0]?.total_quantity || 0),
    totalStockValue: Math.round(Number(result[0]?.total_stock_value || 0)),
    totalSellValue: Math.round(Number(result[0]?.total_sell_value || 0)),
  };
}

export type InventoryAlertSummary = {
  damagedQuantity: number;
  damagedValue: number;
  returnQuantity: number;
  expiredQuantity: number;
  expiredValue: number;
};

export async function getInventoryAlertSummary(): Promise<InventoryAlertSummary> {
  const today = new Date().toISOString().slice(0, 10);

  const damagedQuery = `
    SELECT 
      COALESCE(SUM(quantity), 0) as damaged_quantity,
      COALESCE(SUM(quantity * cost), 0) as damaged_value
    FROM stocks
    WHERE \`condition\` = 'damaged'
  `;

  const returnedQuery = `
    SELECT COALESCE(SUM(oi.quantity), 0) as return_quantity
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.status = 'RETURN'
  `;

  const expiredQuery = `
    SELECT 
      COALESCE(SUM(quantity), 0) as expired_quantity,
      COALESCE(SUM(quantity * cost), 0) as expired_value
    FROM stocks
    WHERE \`condition\` = 'new' 
      AND expire_date IS NOT NULL 
      AND expire_date < ?
  `;

  const [damagedRow, returnedRow, expiredRow] = await Promise.all([
    prisma.$queryRawUnsafe<any[]>(damagedQuery),
    prisma.$queryRawUnsafe<any[]>(returnedQuery),
    prisma.$queryRawUnsafe<any[]>(expiredQuery, today),
  ]);

  return {
    damagedQuantity: Number(damagedRow[0]?.damaged_quantity || 0),
    damagedValue: Math.round(Number(damagedRow[0]?.damaged_value || 0)),
    returnQuantity: Number(returnedRow[0]?.return_quantity || 0),
    expiredQuantity: Number(expiredRow[0]?.expired_quantity || 0),
    expiredValue: Math.round(Number(expiredRow[0]?.expired_value || 0)),
  };
}

export async function decreaseStock(
  barcode: string,
  quantity: number,
  tx?: any,
) {
  const dbs = tx || prisma;
  const stockItem = await dbs.stocks.findFirst({ where: { barcode } });

  if (!stockItem || stockItem.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  await dbs.stocks.updateMany({
    where: { barcode },
    data: { quantity: { decrement: quantity } },
  });
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
  tx?: any,
) {
  const dbs = tx || prisma;

  const increasedStock = await dbs.stocks.create({
    data: {
      product_id: BigInt(productId),
      branch_id: branchId,
      color_id: colorId,
      size_id: sizeId,
      quantity,
      cost,
      barcode,
      condition: condition || "new",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return increasedStock;
}

export async function updateStockCondition(itemIds: bigint[]) {
  if (itemIds.length === 0) {
    throw new Error("No items provided to update");
  }

  await prisma.stocks.updateMany({
    where: { id: { in: itemIds } },
    data: {
      condition: "damaged",
      updated_at: new Date(),
    },
  });
}

export async function updateStockBranchId(
  _challanId: bigint,
  toBranchId: number,
  quantity: number,
  barcode: string,
  tx?: any,
) {
  const branchId = Number(toBranchId);
  const moveQuantity = Number(quantity);
  const productBarcode = String(barcode);

  if (!productBarcode) {
    throw new Error("Missing barcode for stock transfer.");
  }

  if (!Number.isInteger(branchId) || branchId <= 0) {
    throw new Error("Invalid destination branch ID for stock transfer.");
  }

  if (!Number.isInteger(moveQuantity) || moveQuantity <= 0) {
    throw new Error("Invalid quantity for stock transfer.");
  }

  const moveStock = async (prismaTx: any) => {
    const stockEntries = await prismaTx.stocks.findMany({
      where: {
        barcode: productBarcode,
        branch_id: { not: branchId },
      },
      orderBy: { updated_at: "asc" },
      select: {
        id: true,
        product_id: true,
        barcode: true,
        color_id: true,
        size_id: true,
        cost: true,
        quantity: true,
        condition: true,
      },
    });

    let remainingQuantity = moveQuantity;

    for (const stock of stockEntries) {
      if (remainingQuantity <= 0) break;

      const currentQuantity = Number(stock.quantity ?? 0);
      if (currentQuantity <= 0) continue;

      const updateQty = Math.min(currentQuantity, remainingQuantity);
      remainingQuantity -= updateQty;

      await prismaTx.stocks.update({
        where: { id: stock.id },
        data: {
          quantity: currentQuantity - updateQty,
          updated_at: new Date(),
        },
      });

      const existingStock = await prismaTx.stocks.findFirst({
        where: { barcode: productBarcode, branch_id: branchId },
      });

      if (existingStock) {
        await prismaTx.stocks.update({
          where: { id: existingStock.id },
          data: {
            quantity: Number(existingStock.quantity ?? 0) + updateQty,
            updated_at: new Date(),
          },
        });
      } else {
        await prismaTx.stocks.create({
          data: {
            barcode: productBarcode,
            branch_id: branchId,
            quantity: updateQty,
            product_id: stock.product_id,
            cost: stock.cost,
            color_id: stock.color_id,
            size_id: stock.size_id,
            condition: stock.condition,
            updated_at: new Date(),
            created_at: new Date(),
          },
        });
      }
    }

    return {
      moved: moveQuantity - remainingQuantity,
      remaining: remainingQuantity,
      targetBranchId: branchId,
      barcode: productBarcode,
    };
  };

  if (tx) {
    return await moveStock(tx);
  } else {
    return await prisma.$transaction(moveStock);
  }
}

export async function updateStockQuantity(
  quantity: number,
  barcode: string,
  tx?: any,
) {
  const dbs = tx || prisma;

  await dbs.stocks.updateMany({
    where: { barcode },
    data: {
      quantity: quantity,
      updated_at: new Date(),
    },
  });
}
