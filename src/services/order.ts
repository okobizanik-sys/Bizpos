"use server";

import prisma from "@/db/prisma";
import { logger } from "../lib/winston";
import { OrderItem, OrderItems, Orders } from "@/types/shared";
import { OrderWithItem } from "@/app/(admin-panel)/pos/item-selector";
import { OrderFilter } from "@/app/(admin-panel)/orders/orders-list/page";

// ensureOrderItemsSchema removed as schema is statically managed

export async function createOrder(data: Orders) {
  const order = await prisma.orders.create({ data: data as any });
  logger.info(`Order created successfully: ${order.id}`);
  return order;
}

export async function getOrders(
  filters: OrderFilter & { page?: number; per_page?: number; branchId?: number }
): Promise<Orders[]> {
  const {
    search,
    status,
    saleChannel,
    fromDate,
    toDate,
    branchId,
    page = 1,
    per_page = 20,
  } = filters;
  const offset = (page - 1) * per_page;

  let whereStr = "1=1";
  const queryParams: any[] = [];

  if (branchId) {
    whereStr += " AND o.branch_id = ?";
    queryParams.push(branchId);
  }

  if (search) {
    whereStr += " AND (c.customer LIKE ? OR c.phone LIKE ? OR o.order_id LIKE ?)";
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    if (status === "ALL") {
      whereStr += " AND o.status IN ('COMPLETED', 'EXCHANGED')";
    } else {
      whereStr += " AND o.status = ?";
      queryParams.push(status);
    }
  }

  if (saleChannel && saleChannel !== "ALL") {
    whereStr += " AND o.sale_channel = ?";
    queryParams.push(saleChannel);
  }

  if (fromDate) {
    whereStr += " AND o.date >= ?";
    queryParams.push(fromDate);
  }

  if (toDate) {
    whereStr += " AND o.date <= ?";
    queryParams.push(toDate);
  }

  const query = `
    SELECT 
      o.*,
      c.customer,
      c.phone,
      c.address,
      s.name as supplierName
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN suppliers s ON o.supplier_id = s.id
    WHERE ${whereStr}
    ORDER BY o.date DESC
    LIMIT ${per_page} OFFSET ${offset}
  `;

  return await prisma.$queryRawUnsafe<Orders[]>(query, ...queryParams);
}

export async function getOrdersCount(
  filters: OrderFilter & { branchId?: number }
): Promise<number> {
  const { search, status, saleChannel, fromDate, toDate, branchId } = filters;

  let whereStr = "1=1";
  const queryParams: any[] = [];

  if (branchId) {
    whereStr += " AND o.branch_id = ?";
    queryParams.push(branchId);
  }

  if (search) {
    whereStr += " AND (c.customer LIKE ? OR c.phone LIKE ? OR o.order_id LIKE ?)";
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    if (status === "ALL") {
      whereStr += " AND o.status IN ('COMPLETED', 'EXCHANGED')";
    } else {
      whereStr += " AND o.status = ?";
      queryParams.push(status);
    }
  }

  if (saleChannel && saleChannel !== "ALL") {
    whereStr += " AND o.sale_channel = ?";
    queryParams.push(saleChannel);
  }

  if (fromDate) {
    whereStr += " AND o.date >= ?";
    queryParams.push(fromDate);
  }

  if (toDate) {
    whereStr += " AND o.date <= ?";
    queryParams.push(toDate);
  }

  const query = `
    SELECT COUNT(DISTINCT o.id) as total
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE ${whereStr}
  `;

  const result = await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
  return Number(result[0]?.total || 0);
}

export async function getOrdersByCustomer(
  filters: OrderFilter
): Promise<Orders[]> {
  const { search, status, fromDate, toDate } = filters;

  let whereStr = "1=1";
  const queryParams: any[] = [];

  if (search) {
    whereStr += " AND (c.customer LIKE ? OR c.phone LIKE ? OR o.order_id LIKE ?)";
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    whereStr += " AND o.status = ?";
    queryParams.push(status);
  }

  if (fromDate) {
    whereStr += " AND o.date >= ?";
    queryParams.push(fromDate);
  }

  if (toDate) {
    whereStr += " AND o.date <= ?";
    queryParams.push(toDate);
  }

  const query = `
    SELECT 
      o.*,
      c.customer,
      c.phone,
      c.address
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE ${whereStr}
    ORDER BY o.date DESC
  `;

  return await prisma.$queryRawUnsafe<Orders[]>(query, ...queryParams);
}

export async function getOrderByOrderId(orderId: string): Promise<Orders> {
  const query = `
    SELECT 
      o.*,
      c.customer,
      c.phone,
      c.address,
      s.name as supplierName
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN suppliers s ON o.supplier_id = s.id
    WHERE o.order_id = ?
    ORDER BY o.date DESC
    LIMIT 1
  `;

  const result = await prisma.$queryRawUnsafe<Orders[]>(query, orderId);
  return result[0];
}

export async function getOrderById(id: number): Promise<OrderItems | null> {
  const order = await prisma.orders.findFirst({ where: { id: BigInt(id) } });
  if (!order) return null;

  const orderItems = await prisma.order_items.findMany({ where: { order_id: BigInt(id) } });
  return { ...order, orderItems } as unknown as OrderItems;
}

function mapWhereParams(where: Record<string, any>) {
  let whereStr = "1=1";
  const queryParams: any[] = [];
  
  for (const key in where) {
    if (where.hasOwnProperty(key)) {
      if (key === 'orders.id' || key === 'id') {
        whereStr += " AND o.id = ?";
      } else if (key === 'orders.order_id') {
        whereStr += " AND o.order_id = ?";
      } else {
        // Fallback for simple equal matches
        whereStr += ` AND ${key.replace('orders.', 'o.').replace('order_items.', 'oi.')} = ?`;
      }
      queryParams.push(where[key]);
    }
  }
  return { whereStr, queryParams };
}

export async function getOrderByIdWithItems(params: {
  where: { [key: string]: any };
}): Promise<OrderWithItem[] | null> {
  const { whereStr, queryParams } = mapWhereParams(params.where);

  const query = `
    SELECT 
      oi.*,
      o.id as ordersId,
      o.order_id as orderId,
      p.id as productId,
      p.name as productName,
      p.selling_price as sellingPrice,
      col.name as colorName,
      col.id as colorId,
      sz.name as sizeName,
      sz.id as sizeId,
      i.url as productImageUrl,
      s.cost,
      b.id as branchId,
      c.customer,
      c.phone,
      c.address,
      c.id as customerId
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN images i ON p.image_id = i.id
    LEFT JOIN products_colors pc ON pc.product_id = p.id
    LEFT JOIN products_sizes ps ON ps.product_id = p.id
    LEFT JOIN stocks s ON s.product_id = p.id
    LEFT JOIN colors col ON oi.color_id = col.id
    LEFT JOIN sizes sz ON oi.size_id = sz.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE ${whereStr}
  `;

  const orderItem = await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);

  const order = orderItem.reduce((acc: any, item: any) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = {
        orderId: item.orderId,
        ordersId: item.ordersId,
        customer: item.customer,
        phone: item.phone,
        address: item.address,
        customerId: item.customerId,
        items: [],
      };
    }
    const isDuplicate = acc[item.orderId].items.some(
      (i: any) => i.barcode === item.barcode
    );

    if (!isDuplicate && item.id) { // Ensure item exists
      acc[item.orderId].items.push({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        sellingPrice: item.sellingPrice,
        colorName: item.colorName,
        sizeName: item.sizeName,
        barcode: item.barcode,
        quantity: item.quantity,
        colorId: item.colorId,
        sizeId: item.sizeId,
        cost: item.cost,
        productImageUrl: item.productImageUrl,
      });
    }

    return acc;
  }, {});

  return Object.values(order);
}

export async function getOrdersWithItems(params: {
  where: { [key: string]: any };
}): Promise<OrderWithItem[] | null> {
  const { whereStr, queryParams } = mapWhereParams(params.where);

  const query = `
    SELECT 
      oi.*,
      o.*,
      o.id as ordersId,
      o.order_id as orderId,
      p.id as productId,
      p.name as productName,
      p.selling_price as sellingPrice,
      col.name as colorName,
      col.id as colorId,
      sz.name as sizeName,
      sz.id as sizeId,
      i.url as productImageUrl,
      s.cost,
      b.id as branchId,
      c.customer,
      c.phone,
      c.address,
      c.id as customerId
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN images i ON p.image_id = i.id
    LEFT JOIN products_colors pc ON pc.product_id = p.id
    LEFT JOIN products_sizes ps ON ps.product_id = p.id
    LEFT JOIN stocks s ON s.product_id = p.id
    LEFT JOIN colors col ON oi.color_id = col.id
    LEFT JOIN sizes sz ON oi.size_id = sz.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE ${whereStr}
    ORDER BY o.created_at DESC
  `;

  const orderItems = await prisma.$queryRawUnsafe<any[]>(query, ...queryParams);
  const orders = orderItems.reduce((acc: any, item: any) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = {
        orderId: item.orderId,
        ordersId: item.ordersId,
        total: item.total,
        sub_total: item.sub_total,
        discount: item.discount,
        vat: item.vat,
        paid_amount: item.paid_amount,
        due_amount: item.due_amount,
        customer: item.customer,
        phone: item.phone,
        address: item.address,
        customerId: item.customerId,
        delivery_charge: item.delivery_charge,
        payment_method: item.payment_method,
        items: [],
      };
    }
    const isDuplicate = acc[item.orderId].items.some(
      (i: any) => i.barcode === item.barcode
    );

    if (!isDuplicate && item.id) {
      acc[item.orderId].items.push({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        sellingPrice: item.sellingPrice,
        colorName: item.colorName,
        sizeName: item.sizeName,
        barcode: item.barcode,
        quantity: item.quantity,
        colorId: item.colorId,
        sizeId: item.sizeId,
        productImageUrl: item.productImageUrl,
        cost: item.cost,
      });
    }

    return acc;
  }, {});

  return Object.values(orders);
}

export async function updateOrderStatus(
  id: number,
  status: "COMPLETED" | "EXCHANGED" | "RETURN"
) {
  const order = await prisma.orders.update({
    where: { id: BigInt(id) },
    data: { status }
  });
  return order;
}

export async function updateOrder(
  id: number,
  data: Partial<Orders>,
  itemsData: OrderItem[] = []
) {
  await prisma.orders.update({
    where: { id: BigInt(id) },
    data: data as any
  });

  logger.info(`Order updated: ${id}`);

  if (itemsData.length > 0) {
    for (const item of itemsData) {
      const { id: itemId, ...updateFields } = item as any;

      if (itemId) {
        const existingItem = await prisma.order_items.findFirst({
          where: { id: BigInt(itemId), order_id: BigInt(id) }
        });

        if (existingItem) {
          await prisma.order_items.update({
            where: { id: BigInt(itemId) },
            data: updateFields
          });
          logger.info(`Order item updated: ${itemId}`);
        } else {
          logger.warn(`Order item with id ${itemId} not found for update.`);
        }
      } else {
        await prisma.order_items.create({
          data: { ...updateFields, order_id: BigInt(id) }
        });
        logger.info(`New order item created: ${item.product_id}`);
      }
    }
  }

  const updatedOrderWithItems = await getOrderById(id);
  return updatedOrderWithItems;
}

export async function updateOrderByOrderId(
  orderId: string,
  data: Partial<Orders>,
  itemsData: OrderItem[] = []
) {
  const updatedOrder = await prisma.orders.updateMany({
    where: { order_id: orderId },
    data: data as any
  });

  const order = await prisma.orders.findFirst({ where: { order_id: orderId } });

  logger.info(`Order updated: ${order?.id}`);

  if (order) {
     return await getOrderById(Number(order.id));
  }
  
  return null;
}
