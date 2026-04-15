"use server";

import { usePOSStore } from "@/hooks/store/use-pos-store";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import { POSItem } from "./item-selector";
import { Branches, OrderItem, OrderItems, Orders } from "@/types/shared";
import { CustomerData } from "./exchange-form";
import db from "@/db/database";
import { toUpperCaseWords } from "@/utils/helpers";
import { updateOrderByOrderId } from "@/services/order";
import { ensureSalesSchema } from "@/services/supplier";

export async function createBillDetails(
  formData: FormData,
  total: number,
  branch: Branches,
  itemList: POSItem[],
  orderId: string,
  deliveryCharge: number,
  discount: number,
  customBdtAmount: number,
  subtotal: number,
) {
  try {
    await ensureSalesSchema();

    await db.transaction(async (trx) => {
      const { calculateTotals } = usePOSStore.getState();

      calculateTotals();
      // setOrderId();

      // const { orderId } = usePOSStore.getState();
      // console.log(orderId, "orderid from pos action");

      if (total === 0) {
        throw new Error(
          "Total is 0. Ensure that the items are properly calculated.",
        );
      }

      const customerData = {
        customer: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: toUpperCaseWords(String(formData.get("address"))),
      };

      const [insertResult] = await trx("customers").insert(customerData);
      const lastInsertId = insertResult;

      const [customer] = await trx("customers").where({ id: lastInsertId });
      logger.info(`Customer created: ${customer.id}`);

      const orderData: Orders = {
        order_id: orderId,
        total: total,
        customer_id: customer.id,
        branch_id: Number(branch.id),
        delivery_charge: Number(deliveryCharge),
        discount: Number(discount) + Number(customBdtAmount),
        sub_total: Number(subtotal),
        sale_channel:
          (String(formData.get("saleChannel") || "OFFLINE").toUpperCase() as
            | "ONLINE"
            | "OFFLINE"),
      };

      const [insertOrderResult] = await trx("orders").insert(orderData);
      const lastInsertOrderId = insertOrderResult;

      const [order] = await trx("orders").where({ id: lastInsertOrderId });
      logger.info(`Order created: ${order.id}`);

      const orderItems: OrderItem[] = itemList.map((item: POSItem) => ({
        order_id: order.id,
        product_id: Number(item.productId),
        quantity: item.quantity,
        barcode: item.barcode,
        price: item.selling_price * item.quantity,
        cogs: Number(item.cost) * item.quantity,
        color_id: item.colorId ? Number(item.colorId) : null,
        size_id: item.sizeId ? Number(item.sizeId) : null,
      }));

      const [insertedIds] = await trx("order_items").insert(orderItems);
      const lastInsertIds = insertedIds;

      const orderItem = await trx("order_items").where({
        id: lastInsertIds,
      });
      logger.info(`Items created ${orderItem}`);
      // ✅ Update Stocks Instead of Deleting Rows
      for (const item of itemList) {
        const stocks = await trx("stocks")
          .where({
            product_id: item.productId,
            branch_id: Number(branch.id),
            barcode: item.barcode,
          })
          .andWhere({ condition: "new" })
          .orderBy("created_at", "asc");

        const totalAvailable = stocks.reduce(
          (sum: number, stock: { quantity: number }) =>
            sum + Number(stock.quantity),
          0
        );

        if (!stocks.length || totalAvailable < item.quantity) {
          throw new Error(`Insufficient stock for barcode: ${item.barcode}`);
        }

        let remainingQuantity = item.quantity;

        for (const stock of stocks) {
          if (remainingQuantity <= 0) break;

          const deductQuantity = Math.min(
            Number(stock.quantity),
            remainingQuantity
          );
          const newQuantity = Number(stock.quantity) - deductQuantity;
          remainingQuantity -= deductQuantity;

          if (newQuantity > 0) {
            await trx("stocks")
              .where({ id: stock.id })
              .update({ quantity: newQuantity, updated_at: new Date() });
          } else {
            await trx("stocks").where({ id: stock.id }).delete();
          }
        }
      }

      revalidatePath("/dashboard");
      revalidatePath("/pos");
      revalidatePath("/orders/orders-list");
      revalidatePath("/orders/return-orders");
      revalidatePath("/sales/sales-list");
      revalidatePath("/sales/discounted-sales");
      revalidatePath("/customers/customers-list");
      revalidatePath("/customers/fraud-customers");
      revalidatePath("/customers/customers-data");

      return { customer, order };
    });
  } catch (error) {
    logger.error(`Error in createBillDetails: ${error}`);
    throw error;
  }
}

// export async function updateBillDetails(
//   returnItemList: OrderItems[],
//   formData: FormData,
//   total: number,
//   branch: Branches,
//   exchangeItemList: OrderItems[],
//   addExchangeItemList: OrderItems[],
//   customerData?: CustomerData
// ) {
//   try {
//     await db.transaction(async (trx) => {
//       const customersData = {
//         customer: formData.get("name") as string,
//         phone: formData.get("phone") as string,
//         address: toUpperCaseWords(String(formData.get("address"))),
//       };

//       const customerId = customerData?.customerId as number;

//       const insertResult = await trx("customers")
//         .where({ id: customerId })
//         .update(customersData);
//       const lastInsertId = insertResult;

//       const [customer] = await trx("customers").where({ id: lastInsertId });
//       logger.info(`Customer updated: ${customer}`);

//       const { calculateExgTotals } = usePOSStore.getState();
//       calculateExgTotals();
//       if (!total) {
//         throw new Error("total is 0");
//       }

//       const orderDataInput: Orders = {
//         order_id: customerData?.orderId as string,
//         total: total,
//         customer_id: customerId,
//         branch_id: Number(branch.id),
//         status: "EXCHANGED",
//       };

//       const ordersId = customerData?.id as number;
//       const orderId = customerData?.orderId as string;

//       if (!ordersId || !orderId) {
//         throw new Error("Order ID is required to update the order.");
//       }

//       await trx("orders").where({ id: ordersId }).update(orderDataInput);
//       const [updatedOrder] = await trx("orders").where({ id: ordersId });

//       logger.info(`Order updated: ${updatedOrder.id}`);
//       for (const item of addExchangeItemList) {
//         const orderEntries = Array(item.quantity).fill({
//           order_id: BigInt(ordersId),
//           product_id: Number(item.productId),
//           quantity: item.quantity,
//           price: item.sellingPrice * item.quantity,
//           barcode: item.barcode,
//           color_id: item.colorId,
//           size_id: item.sizeId,
//           created_at: new Date(),
//           updated_at: new Date(),
//         });

//         const stockItems = await trx("stocks")
//           .where({
//             product_id: item.productId,
//             branch_id: Number(branch.id),
//             color_id: item.colorId,
//             size_id: item.sizeId,
//           })
//           .limit(item.quantity);

//         if (stockItems.length < item.quantity) {
//           throw new Error("Insufficient stock");
//         }

//         const stockIdsToDelete = stockItems.map((item) => item.id);
//         await trx("stocks").whereIn("id", stockIdsToDelete).delete();

//         await trx("order_items").insert(orderEntries);
//       }
//       logger.info(`Order_items & stocks updated: `);

//       for (const item of returnItemList) {
//         const stockEntries = Array(item.quantity).fill({
//           product_id: item.productId,
//           branch_id: item.branchId,
//           color_id: item.colorId,
//           size_id: item.sizeId,
//           cost: item.cost,
//           barcode: item.barcode,
//           created_at: new Date(),
//           updated_at: new Date(),
//         });
//         const orderItemToDelete = returnItemList.map((item) => item.barcode);

//         await trx("stocks").insert(stockEntries);
//         await trx("order_items").whereIn("barcode", orderItemToDelete).delete();
//       }

//       revalidatePath("/dashboard");
//       revalidatePath("/pos");
//       revalidatePath("/orders/orders-list");
//       revalidatePath("/orders/return-orders");
//       revalidatePath("/sales/sales-list");
//       revalidatePath("/sales/discounted-sales");
//       revalidatePath("/customers/customers-list");
//       revalidatePath("/customers/fraud-customers");
//       revalidatePath("/customers/customers-data");

//       return { customer };
//     });
//   } catch (error) {
//     logger.error(`Error in createBillDetails: ${error}`);
//     throw error;
//   }
// }

export async function updateBillDetails(
  returnItemList: OrderItems[],
  formData: FormData,
  total: number,
  branch: Branches,
  exchangeItemList: OrderItems[],
  addExchangeItemList: OrderItems[],
  customerData?: CustomerData,
) {
  try {
    await db.transaction(async (trx) => {
      const customersData = {
        customer: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: toUpperCaseWords(String(formData.get("address"))),
      };

      const customerId = customerData?.customerId as number;

      await trx("customers").where({ id: customerId }).update(customersData);
      const [customer] = await trx("customers").where({ id: customerId });
      logger.info(`Customer updated: ${customer}`);

      const { calculateExgTotals, subExgTotal, deliveryCharge } =
        usePOSStore.getState();
      calculateExgTotals();
      if (!total) {
        throw new Error("Total cannot be 0");
      }

      const orderDataInput: Orders = {
        order_id: customerData?.orderId as string,
        total: total,
        sub_total: subExgTotal,
        delivery_charge: deliveryCharge,
        customer_id: customerId,
        branch_id: Number(branch.id),
        status: "EXCHANGED",
      };

      const ordersId = customerData?.id as number;
      const orderId = customerData?.orderId as string;

      if (!ordersId || !orderId) {
        throw new Error("Order ID is required to update the order.");
      }

      await trx("orders").where({ id: ordersId }).update(orderDataInput);
      const [updatedOrder] = await trx("orders").where({ id: ordersId });
      logger.info(`Order updated: ${updatedOrder.id}`);

      // Handle exchanged items (reduce stock instead of deleting rows)
      for (const item of addExchangeItemList) {
        const existingStocks = await trx("stocks")
          .where({
            barcode: item.barcode,
            branch_id: Number(branch.id),
          })
          .andWhere({ condition: "new" })
          .orderBy("created_at", "asc");

        const totalAvailable = existingStocks.reduce(
          (sum: number, stock: { quantity: number }) =>
            sum + Number(stock.quantity),
          0
        );

        if (!existingStocks.length || totalAvailable < item.quantity) {
          throw new Error("Insufficient stock for exchange");
        }

        let remainingQuantity = item.quantity;

        for (const stock of existingStocks) {
          if (remainingQuantity <= 0) break;

          const deductQuantity = Math.min(
            Number(stock.quantity),
            remainingQuantity
          );
          const newQuantity = Number(stock.quantity) - deductQuantity;
          remainingQuantity -= deductQuantity;

          if (newQuantity > 0) {
            await trx("stocks")
              .where({ id: stock.id })
              .update({ quantity: newQuantity, updated_at: new Date() });
          } else {
            await trx("stocks").where({ id: stock.id }).delete();
          }
        }

        // Update or insert order items
        const existingOrderItem = await trx("order_items")
          .where({
            order_id: ordersId,
            product_id: item.productId,
            barcode: item.barcode,
          })
          .first();

        if (existingOrderItem) {
          // Update existing item quantity
          await trx("order_items")
            .where({ id: existingOrderItem.id })
            .update({
              quantity: existingOrderItem.quantity + item.quantity,
              price:
                existingOrderItem.price + item.sellingPrice * item.quantity,
              updated_at: new Date(),
            });
        } else {
          // Insert new item if not found
          await trx("order_items").insert({
            order_id: BigInt(ordersId),
            product_id: Number(item.productId),
            quantity: item.quantity,
            price: item.sellingPrice * item.quantity,
            barcode: item.barcode,
            color_id: item.colorId,
            size_id: item.sizeId,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }

      // Handle returned items (increase stock instead of inserting new rows)
      for (const item of returnItemList) {
        const existingStock = await trx("stocks")
          .where({
            barcode: item.barcode,
            branch_id: item.branchId,
          })
          .first();

        if (existingStock) {
          // Increase stock quantity
          await trx("stocks")
            .where({ id: existingStock.id })
            .update({ quantity: existingStock.quantity + item.quantity });
        } else {
          // Insert new stock entry if it doesn’t exist
          await trx("stocks").insert({
            product_id: item.productId,
            branch_id: item.branchId,
            color_id: item.colorId,
            size_id: item.sizeId,
            barcode: item.barcode,
            cost: item.cost,
            quantity: item.quantity,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }

        // Update order items instead of deleting them
        const existingOrderItem = await trx("order_items")
          .where({
            order_id: ordersId,
            product_id: item.productId,
            barcode: item.barcode,
          })
          .first();

        if (existingOrderItem) {
          if (existingOrderItem.quantity > item.quantity) {
            // Reduce quantity instead of deleting the row
            await trx("order_items")
              .where({ id: existingOrderItem.id })
              .update({
                quantity: existingOrderItem.quantity - item.quantity,
                updated_at: new Date(),
              });
          } else {
            // If quantity becomes zero, delete the row
            await trx("order_items")
              .where({ id: existingOrderItem.id })
              .delete();
          }
        }
      }

      // Revalidate pages to refresh data
      revalidatePath("/dashboard");
      revalidatePath("/pos");
      revalidatePath("/orders/orders-list");
      revalidatePath("/orders/return-orders");
      revalidatePath("/sales/sales-list");
      revalidatePath("/sales/discounted-sales");
      revalidatePath("/customers/customers-list");
      revalidatePath("/customers/fraud-customers");
      revalidatePath("/customers/customers-data");

      return { customer };
    });
  } catch (error) {
    logger.error(`Error in updateBillDetails: ${error}`);
    throw error;
  }
}

export async function updatePaymentInfo(orderId: string, formData: FormData) {
  try {
    const paymentInfo = {
      payment_method: formData.get("paymentMethod") as string,
      paid_amount: Number(formData.get("advanceAmount") as string),
      due_amount: Number(formData.get("dueAmount") as string),
    };

    const result = await updateOrderByOrderId(orderId, paymentInfo);

    revalidatePath("/dashboard");
    revalidatePath("/pos");
    revalidatePath("/orders/orders-list");
    revalidatePath("/orders/return-orders");
    revalidatePath("/sales/sales-list");
    revalidatePath("/sales/discounted-sales");
    revalidatePath("/customers/customers-list");
    revalidatePath("/customers/fraud-customers");
    revalidatePath("/customers/customers-data");
    if (result) {
      return { status: "success", data: result };
    }
  } catch (error) {
    logger.error(`Error in updatePaymentInfo: ${error}`);
    throw error;
  }
}
