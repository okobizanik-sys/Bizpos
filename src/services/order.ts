"use server";

import db from "@/db/database";
import { logger } from "../lib/winston";
import { OrderItem, OrderItems, Orders } from "@/types/shared";
import { OrderWithItem } from "@/app/(admin-panel)/pos/item-selector";
import { OrderFilter } from "@/app/(admin-panel)/orders/orders-list/page";

// Create a new order
export async function createOrder(data: Orders) {
  const [insertResult] = await db("orders").insert(data);
  const lastInsertId = insertResult;

  const [order] = await db("orders").where({ id: lastInsertId });
  logger.info(`Order created successfully: ${order.id}`);
  return order;
}

// Get all orders with optional filters
// export async function getOrders(filters: OrderFilter): Promise<Orders[]> {
//   const { search, status, fromDate, toDate } = filters;

//   const query = db("orders")
//     .leftJoin("customers", "orders.customer_id", "customers.id")
//     .select(
//       "orders.*",
//       "customers.customer",
//       "customers.phone",
//       "customers.address"
//     )
//     .orderBy("date", "desc");
//   if (search) {
//     query.where(function () {
//       this.where("customers.customer", "LIKE", `%${search}%`)
//         .orWhere("customers.phone", "LIKE", `%${search}%`)
//         .orWhere("orders.order_id", "LIKE", `%${search}%`); // Adjust field names as necessary
//     });
//   }

//   if (status) {
//     // query.andWhere("orders.status", status);
//     if (status === "ALL") {
//       query.whereIn("orders.status", ["COMPLETED", "EXCHANGED"]);
//     } else {
//       query.andWhere("orders.status", status);
//     }
//   }

//   if (fromDate) {
//     query.andWhere("orders.date", ">=", fromDate);
//   }

//   if (toDate) {
//     query.andWhere("orders.date", "<=", toDate);
//   }

//   const orders = await query;

//   return orders;
// }

export async function getOrders(
  filters: OrderFilter & { page?: number; per_page?: number; branchId?: number }
): Promise<Orders[]> {
  const { search, status, fromDate, toDate, page = 1, per_page = 20 } = filters;
  const offset = (page - 1) * per_page;

  const query = db("orders")
    .leftJoin("customers", "orders.customer_id", "customers.id")
    .select(
      "orders.*",
      "customers.customer",
      "customers.phone",
      "customers.address"
    )
    // .where("orders.branch_id", filters.branchId)
    .orderBy("date", "desc")
    .limit(per_page)
    .offset(offset);

  if (search) {
    query.where(function () {
      this.where("customers.customer", "LIKE", `%${search}%`)
        .orWhere("customers.phone", "LIKE", `%${search}%`)
        .orWhere("orders.order_id", "LIKE", `%${search}%`);
    });
  }

  if (status) {
    if (status === "ALL") {
      query.whereIn("orders.status", ["COMPLETED", "EXCHANGED"]);
    } else {
      query.andWhere("orders.status", status);
    }
  }

  if (fromDate) {
    query.andWhere("orders.date", ">=", fromDate);
  }

  if (toDate) {
    query.andWhere("orders.date", "<=", toDate);
  }

  return await query;
}

export async function getOrdersByCustomer(
  filters: OrderFilter
): Promise<Orders[]> {
  const { search, status, fromDate, toDate } = filters;

  const query = db("orders")
    .leftJoin("customers", "orders.customer_id", "customers.id")
    .select(
      "orders.*",
      "customers.customer",
      "customers.phone",
      "customers.address"
    )
    .orderBy("date", "desc");
  if (search) {
    query.where(function () {
      this.where("customers.customer", "LIKE", `%${search}%`)
        .orWhere("customers.phone", "LIKE", `%${search}%`)
        .orWhere("orders.order_id", "LIKE", `%${search}%`); // Adjust field names as necessary
    });
  }

  if (status) {
    query.andWhere("orders.status", status);
  }

  if (fromDate) {
    query.andWhere("orders.date", ">=", fromDate);
  }

  if (toDate) {
    query.andWhere("orders.date", "<=", toDate);
  }

  const orders = await query;

  return orders;
}

export async function getOrderByOrderId(orderId: string): Promise<Orders> {
  const query = db("orders")
    .leftJoin("customers", "orders.customer_id", "customers.id")
    .select(
      "orders.*",
      "customers.customer",
      "customers.phone",
      "customers.address"
    )
    .where("orders.order_id", orderId)
    .orderBy("date", "desc")
    .first();

  const order = await query;
  return order;
}

export async function getOrderById(id: number): Promise<OrderItems | null> {
  const order = await db("orders").where({ id }).first(); // Adjust table name
  if (!order) return null;

  const orderItems = await db("order_items").where({ order_id: order.id });
  return { ...order, orderItems };
}

// Get an order by ID
export async function getOrderByIdWithItems(params: {
  where: { [key: string]: any };
}): Promise<OrderWithItem[] | null> {
  const orderItemQuery = db("orders")
    .leftJoin("order_items", "orders.id", "order_items.order_id")
    .leftJoin("products", "order_items.product_id", "products.id")
    .leftJoin("images", "products.image_id", "images.id")
    .leftJoin("products_colors", "products_colors.product_id", "products.id")
    .leftJoin("products_sizes", "products_sizes.product_id", "products.id")
    .leftJoin("stocks", "stocks.product_id", "products.id")
    .leftJoin("colors", "order_items.color_id", "colors.id")
    .leftJoin("sizes", "order_items.size_id", "sizes.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("customers", "orders.customer_id", "customers.id")
    .select(
      "order_items.*",
      "orders.id as ordersId",
      "orders.order_id as orderId",
      "products.id as productId",
      "products.name as productName",
      "products.selling_price as sellingPrice",
      "colors.name as colorName",
      "colors.id as colorId",
      "sizes.name as sizeName",
      "sizes.id as sizeId",
      "images.url as productImageUrl",
      "stocks.cost",
      "branches.id as branchId",
      "customers.customer",
      "customers.phone",
      "customers.address",
      "customers.id as customerId"
    )
    .where(params.where);

  const orderItem = await orderItemQuery;

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
    // Use a combination of unique fields to filter out duplicate items
    const isDuplicate = acc[item.orderId].items.some(
      (i: any) => i.barcode === item.barcode
    );

    if (!isDuplicate) {
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
  const orderItemsQuery = db("orders")
    .leftJoin("order_items", "orders.id", "order_items.order_id")
    .leftJoin("products", "order_items.product_id", "products.id")
    .leftJoin("images", "products.image_id", "images.id")
    .leftJoin("products_colors", "products_colors.product_id", "products.id")
    .leftJoin("products_sizes", "products_sizes.product_id", "products.id")
    .leftJoin("stocks", "stocks.product_id", "products.id")
    .leftJoin("colors", "order_items.color_id", "colors.id")
    .leftJoin("sizes", "order_items.size_id", "sizes.id")
    .leftJoin("branches", "stocks.branch_id", "branches.id")
    .leftJoin("customers", "orders.customer_id", "customers.id")
    .select(
      "order_items.*",
      "orders.*",
      "orders.id as ordersId",
      "orders.order_id as orderId",
      "products.id as productId",
      "products.name as productName",
      "products.selling_price as sellingPrice",
      "colors.name as colorName",
      "colors.id as colorId",
      "sizes.name as sizeName",
      "sizes.id as sizeId",
      "images.url as productImageUrl",
      "stocks.cost",
      "branches.id as branchId",
      "customers.customer",
      "customers.phone",
      "customers.address",
      "customers.id as customerId"
    )
    .where(params.where)
    .orderBy("orders.created_at", "desc");

  const orderItems = await orderItemsQuery;
  // Group order items by orderId
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
    // Use a combination of unique fields to filter out duplicate items
    const isDuplicate = acc[item.orderId].items.some(
      (i: any) => i.barcode === item.barcode
    );

    if (!isDuplicate) {
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

// Update order status
export async function updateOrderStatus(
  id: number,
  status: "COMPLETED" | "EXCHANGED" | "RETURN"
) {
  const order = await db("orders").where({ id }).update({ status });

  // const [order] = await db("orders").where({ insertResult });
  // logger.info(`Order status updated: ${order.id} - ${status}`);
  return order;
}

export async function updateOrder(
  id: number,
  data: Partial<Orders>,
  itemsData: OrderItem[] = []
) {
  // Update order details
  await db("orders").where({ id }).update(data);
  const [updatedOrder] = await db("orders").where({ id });

  logger.info(`Order updated: ${updatedOrder.id}`);

  // Update order items if provided
  if (itemsData.length > 0) {
    for (const item of itemsData) {
      const { id: itemId, ...updateFields } = item;

      // Check if the item has an ID, update if it does, otherwise insert as new item
      if (itemId) {
        const existingItem = await db("order_items")
          .where({ id: itemId, order_id: id })
          .first();

        if (existingItem) {
          await db("order_items")
            .where({ id: itemId, order_id: id })
            .update(updateFields);
          logger.info(`Order item updated: ${itemId}`);
        } else {
          logger.warn(`Order item with id ${itemId} not found for update.`);
        }
      } else {
        // Insert a new item if itemId is undefined
        await db("order_items").insert({ ...item, order_id: id });
        logger.info(`New order item created: ${item.product_id}`);
      }
    }
  }

  // Retrieve the updated order with its items to return
  const updatedOrderWithItems = await getOrderById(id);
  return updatedOrderWithItems;
}

export async function updateOrderByOrderId(
  orderId: string,
  data: Partial<Orders>,
  itemsData: OrderItem[] = []
) {
  // Update order details
  await db("orders").where({ order_id: orderId }).update(data);
  const [updatedOrder] = await db("orders").where({ order_id: orderId });

  logger.info(`Order updated: ${updatedOrder.id}`);

  // Retrieve the updated order with its items to return
  const updatedOrderWithItems = await getOrderById(updatedOrder.id);
  return updatedOrderWithItems;
}
