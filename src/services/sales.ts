"use server";

import prisma from "@/db/prisma";
import { logger } from "../lib/winston";
import { DashboardSalesData, SalesData, SalesSummary } from "@/types/shared";
import { OrderFilter } from "@/app/(admin-panel)/orders/orders-list/page";
import { Prisma } from "@/generated/prisma";

export type DashboardFilterType = "today" | "week" | "month" | "lifetime";
export type DashboardSummary = {
  totalOrders: number;
  totalSales: number;
  totalCOGS: number;
  totalDueAmount: number;
  totalPaidAmount: number;
  branchWiseTotals: Record<
    string,
    {
      totalOrders: number;
      totalSales: number;
      totalCOGS: number;
    }
  >;
};

export async function getSalesData(filters: OrderFilter): Promise<SalesData[]> {
  const { fromDate, toDate, search, saleChannel } = filters;

  let whereStr = "o.status IN ('COMPLETED', 'EXCHANGED')";
  const queryParams: any[] = [];

  if (search) {
    whereStr += " AND (c.customer LIKE ? OR c.phone LIKE ? OR o.order_id LIKE ?)";
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (saleChannel && saleChannel !== "ALL") {
    whereStr += " AND o.sale_channel = ?";
    queryParams.push(saleChannel);
  }

  if (fromDate && toDate) {
    whereStr += " AND o.date BETWEEN ? AND ?";
    queryParams.push(fromDate, toDate);
  } else if (fromDate) {
    whereStr += " AND o.date >= ?";
    queryParams.push(fromDate);
  } else if (toDate) {
    whereStr += " AND o.date <= ?";
    queryParams.push(toDate);
  }

  const query = `
    SELECT 
      o.date,
      b.id as branchId,
      b.name as branchName,
      o.order_id,
      c.customer,
      c.phone,
      c.address,
      o.total,
      o.sub_total,
      o.vat,
      o.paid_amount,
      o.due_amount,
      o.discount,
      o.delivery_charge,
      o.sale_channel,
      o.supplier_id,
      s.name as supplierName,
      COALESCE(oc.cogs_total, 0) as cost_of_goods_sold
    FROM orders o
    LEFT JOIN branches b ON o.branch_id = b.id
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN suppliers s ON o.supplier_id = s.id
    LEFT JOIN (
      SELECT order_id, SUM(cogs) as cogs_total
      FROM order_items
      GROUP BY order_id
    ) oc ON oc.order_id = o.id
    WHERE ${whereStr}
    ORDER BY o.date DESC
  `;

  const salesData = await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
  logger.info("Sales data fetched successfully");
  return salesData.map((order) => ({
    ...order,
    cost_of_goods_sold: Math.round(Number(order.cost_of_goods_sold || 0)),
  }));
}

const getDashboardDateRange = (filter: DashboardFilterType) => {
  const now = new Date();
  const endExclusive = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  endExclusive.setHours(0, 0, 0, 0);

  if (filter === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    start.setHours(0, 0, 0, 0);
    return { start, endExclusive };
  }

  if (filter === "week") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    start.setHours(0, 0, 0, 0);
    const dayOfWeek = start.getDay();
    const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    start.setDate(diff);
    return { start, endExclusive };
  }

  if (filter === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    return { start, endExclusive };
  }

  return null;
}

export async function getDashboardSalesData(
  filter: DashboardFilterType = "lifetime",
): Promise<DashboardSalesData[]> {
  let whereStr = "o.status IN ('COMPLETED', 'EXCHANGED')";
  const queryParams: any[] = [];

  const range = getDashboardDateRange(filter);
  if (range) {
    whereStr += " AND o.date >= ? AND o.date < ?";
    queryParams.push(range.start, range.endExclusive);
  }

  const query = `
    SELECT 
      o.date,
      o.branch_id as branchId,
      o.total,
      o.due_amount,
      o.paid_amount,
      COALESCE(oc.cogs_total, 0) as cost_of_goods_sold
    FROM orders o
    LEFT JOIN (
      SELECT order_id, SUM(cogs) as cogs_total
      FROM order_items
      GROUP BY order_id
    ) oc ON oc.order_id = o.id
    WHERE ${whereStr}
    ORDER BY o.date DESC
  `;

  const salesData = await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
  logger.info("Dashboard sales data fetched successfully");
  return salesData.map((order) => ({
    ...order,
    cost_of_goods_sold: Math.round(Number(order.cost_of_goods_sold || 0)),
  }));
}

const normalizeNumber = (value: unknown) => Number(value || 0);

export async function getDashboardSummary(
  filter: DashboardFilterType = "lifetime",
): Promise<DashboardSummary> {
  let whereStr = "o.status IN ('COMPLETED', 'EXCHANGED')";
  const queryParams: any[] = [];

  const range = getDashboardDateRange(filter);
  if (range) {
    whereStr += " AND o.date >= ? AND o.date < ?";
    queryParams.push(range.start, range.endExclusive);
  }

  const summaryQuery = `
    SELECT 
      COUNT(o.id) as totalOrders,
      COALESCE(SUM(o.total), 0) as totalSales,
      COALESCE(SUM(o.due_amount), 0) as totalDueAmount,
      COALESCE(SUM(o.paid_amount), 0) as totalPaidAmount,
      COALESCE(SUM(oc.cogs_total), 0) as totalCOGS
    FROM orders o
    LEFT JOIN (
      SELECT order_id, SUM(cogs) as cogs_total
      FROM order_items
      GROUP BY order_id
    ) oc ON oc.order_id = o.id
    WHERE ${whereStr}
  `;

  const branchQuery = `
    SELECT 
      o.branch_id as branchId,
      COUNT(o.id) as totalOrders,
      COALESCE(SUM(o.total), 0) as totalSales,
      COALESCE(SUM(oc.cogs_total), 0) as totalCOGS
    FROM orders o
    LEFT JOIN (
      SELECT order_id, SUM(cogs) as cogs_total
      FROM order_items
      GROUP BY order_id
    ) oc ON oc.order_id = o.id
    WHERE ${whereStr}
    GROUP BY o.branch_id
  `;

  const [summaryRows, branchRows] = await Promise.all([
    prisma.$queryRawUnsafe<any[]>(summaryQuery, ...queryParams),
    prisma.$queryRawUnsafe<any[]>(branchQuery, ...queryParams)
  ]);

  const summaryRow = summaryRows[0];

  const branchWiseTotals: DashboardSummary["branchWiseTotals"] = {};
  for (const row of branchRows) {
    branchWiseTotals[String(row.branchId)] = {
      totalOrders: normalizeNumber(row.totalOrders),
      totalSales: normalizeNumber(row.totalSales),
      totalCOGS: normalizeNumber(row.totalCOGS),
    };
  }

  logger.info("Dashboard summary fetched successfully");
  return {
    totalOrders: normalizeNumber(summaryRow?.totalOrders),
    totalSales: normalizeNumber(summaryRow?.totalSales),
    totalCOGS: normalizeNumber(summaryRow?.totalCOGS),
    totalDueAmount: normalizeNumber(summaryRow?.totalDueAmount),
    totalPaidAmount: normalizeNumber(summaryRow?.totalPaidAmount),
    branchWiseTotals,
  };
}

export async function getTotalSalesSummary(): Promise<SalesSummary> {
  const result = await prisma.$queryRaw<any[]>`
    SELECT 
      SUM(price) as total_sale,
      SUM(cogs) as total_cogs
    FROM order_items
  `;

  return {
    totalCOGS: Number(result[0]?.total_cogs || 0),
    totalSale: Number(result[0]?.total_sale || 0),
  };
}
