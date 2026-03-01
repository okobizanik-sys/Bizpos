import db from "@/db/database";
import { logger } from "../lib/winston";
import { DashboardSalesData, SalesData, SalesSummary } from "@/types/shared";
import { OrderFilter } from "@/app/(admin-panel)/orders/orders-list/page";

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

// export async function getSalesData(filters: OrderFilter): Promise<SalesData[]> {
//   const { fromDate, toDate, search } = filters;

//   return await db.transaction(async (trx) => {
//     const query = trx("orders")
//       .select(
//         "orders.*",
//         "branches.id as branchId",
//         "branches.name as branchName",
//         "customers.customer",
//         "customers.phone",
//         "customers.address"
//       )
//       .where("orders.status", "COMPLETED")
//       .orWhere("orders.status", "EXCHANGED")
//       .leftJoin("branches", "orders.branch_id", "branches.id")
//       .leftJoin("customers", "orders.customer_id", "customers.id")
//       .orderBy("date", "desc");

//     // Apply filters if present
//     if (search) {
//       query.where((builder) => {
//         builder
//           .where("customers.customer", "Like", `%${search}%`)
//           .orWhere("customers.phone", "Like", `%${search}%`)
//           .orWhere("orders.order_id", "Like", `%${search}%`);
//       });
//     }

//     if (fromDate && toDate) {
//       query.whereBetween("orders.date", [fromDate, toDate]);
//     } else if (fromDate) {
//       query.where("orders.date", ">=", fromDate);
//     } else if (toDate) {
//       query.where("orders.date", "<=", toDate);
//     }

//     // Fetch the sales data
//     const salesData = await query;

//     const formattedSales = await Promise.all(
//       salesData.map(async (order) => {
//         const orderItems = await trx("order_items")
//           .where("order_items.order_id", order.id)
//           .leftJoin("products", "order_items.product_id", "products.id")
//           .select("order_items.*", "products.id as productId");

//         // console.log(
//         //   orderItems,
//         //   ":orderitems from sales api. Length:",
//         //   orderItems.length
//         // );
//         // Calculate COGS and stock value
//         // const { totalCOGS } = await getTotalSalesSummary();
//         const { COGS } = await calculateCOGSAndStock(orderItems, trx);

//         return {
//           date: order.date,
//           branchId: order.branchId,
//           branchName: order.branchName,
//           order_id: order.order_id,
//           customer: order.customer,
//           phone: order.phone,
//           address: order.address,
//           total: order.total,
//           sub_total: order.sub_total,
//           vat: order.vat,
//           paid_amount: order.paid_amount,
//           due_amount: order.due_amount,
//           discount: order.discount,
//           delivery_charge: order.delivery_charge,
//           cost_of_goods_sold: Math.round(COGS),
//         };
//       })
//     );

//     logger.info("Sales data fetched successfully");
//     return formattedSales;
//   });
// }

export async function getSalesData(filters: OrderFilter): Promise<SalesData[]> {
  const { fromDate, toDate, search } = filters;

  const cogsSubquery = db("order_items")
    .select("order_id")
    .sum({ cogs_total: "cogs" })
    .groupBy("order_id")
    .as("order_cogs");

  const query = db("orders")
    .select(
      "orders.date",
      "branches.id as branchId",
      "branches.name as branchName",
      "orders.order_id",
      "customers.customer",
      "customers.phone",
      "customers.address",
      "orders.total",
      "orders.sub_total",
      "orders.vat",
      "orders.paid_amount",
      "orders.due_amount",
      "orders.discount",
      "orders.delivery_charge",
      db.raw("COALESCE(order_cogs.cogs_total, 0) as cost_of_goods_sold")
    )
    .whereIn("orders.status", ["COMPLETED", "EXCHANGED"])
    .leftJoin("branches", "orders.branch_id", "branches.id")
    .leftJoin("customers", "orders.customer_id", "customers.id")
    .leftJoin(cogsSubquery, "order_cogs.order_id", "orders.id")
    .orderBy("orders.date", "desc");

  if (search) {
    query.andWhere((builder) => {
      builder
        .where("customers.customer", "Like", `%${search}%`)
        .orWhere("customers.phone", "Like", `%${search}%`)
        .orWhere("orders.order_id", "Like", `%${search}%`);
    });
  }

  if (fromDate && toDate) {
    query.andWhereBetween("orders.date", [fromDate, toDate]);
  } else if (fromDate) {
    query.andWhere("orders.date", ">=", fromDate);
  } else if (toDate) {
    query.andWhere("orders.date", "<=", toDate);
  }

  const salesData = await query;
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
};

export async function getDashboardSalesData(
  filter: DashboardFilterType = "lifetime",
): Promise<DashboardSalesData[]> {
  const cogsSubquery = db("order_items")
    .select("order_id")
    .sum({ cogs_total: "cogs" })
    .groupBy("order_id")
    .as("order_cogs");

  const query = db("orders")
    .select(
      "orders.date",
      "orders.branch_id as branchId",
      "orders.total",
      "orders.due_amount",
      "orders.paid_amount",
      db.raw("COALESCE(order_cogs.cogs_total, 0) as cost_of_goods_sold")
    )
    .whereIn("orders.status", ["COMPLETED", "EXCHANGED"])
    .leftJoin(cogsSubquery, "order_cogs.order_id", "orders.id")
    .orderBy("orders.date", "desc");

  const range = getDashboardDateRange(filter);
  if (range) {
    query
      .andWhere("orders.date", ">=", range.start)
      .andWhere("orders.date", "<", range.endExclusive);
  }

  const salesData = await query;

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
  const cogsSubquery = db("order_items")
    .select("order_id")
    .sum({ cogs_total: "cogs" })
    .groupBy("order_id")
    .as("order_cogs");

  const baseQuery = db("orders")
    .whereIn("orders.status", ["COMPLETED", "EXCHANGED"])
    .leftJoin(cogsSubquery, "order_cogs.order_id", "orders.id");

  const range = getDashboardDateRange(filter);
  if (range) {
    baseQuery
      .andWhere("orders.date", ">=", range.start)
      .andWhere("orders.date", "<", range.endExclusive);
  }

  const summaryRow = await baseQuery
    .clone()
    .select(
      db.raw("COUNT(orders.id) as totalOrders"),
      db.raw("COALESCE(SUM(orders.total), 0) as totalSales"),
      db.raw("COALESCE(SUM(orders.due_amount), 0) as totalDueAmount"),
      db.raw("COALESCE(SUM(orders.paid_amount), 0) as totalPaidAmount"),
      db.raw("COALESCE(SUM(order_cogs.cogs_total), 0) as totalCOGS"),
    )
    .first();

  const branchRows = await baseQuery
    .clone()
    .select(
      "orders.branch_id as branchId",
      db.raw("COUNT(orders.id) as totalOrders"),
      db.raw("COALESCE(SUM(orders.total), 0) as totalSales"),
      db.raw("COALESCE(SUM(order_cogs.cogs_total), 0) as totalCOGS"),
    )
    .groupBy("orders.branch_id");

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
  const result = await db("order_items")
    .select(
      db.raw("SUM(order_items.price) as total_sale"),
      db.raw("SUM(order_items.cogs) as total_cogs")
    )
    .first();

  return {
    totalCOGS: result?.total_cogs || 0,
    totalSale: result?.total_sale || 0,
  };
}
