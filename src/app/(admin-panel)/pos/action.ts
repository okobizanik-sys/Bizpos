"use server";

import { usePOSStore } from "@/hooks/store/use-pos-store";
import { logger } from "@/lib/winston";
import { revalidatePath } from "next/cache";
import { POSItem } from "./item-selector";
import { Branches, OrderItem, OrderItems, Orders } from "@/types/shared";
import { CustomerData } from "./exchange-form";
import prisma from "@/db/prisma";
import { toUpperCaseWords } from "@/utils/helpers";
import { updateOrderByOrderId } from "@/services/order";

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
    await prisma.$transaction(async (tx) => {
      const { calculateTotals } = usePOSStore.getState();

      calculateTotals();

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

      const customer = await tx.customers.create({ data: customerData });
      logger.info(`Customer created: ${customer.id}`);

      const orderData = {
        order_id: orderId,
        total: total,
        customer_id: customer.id,
        branch_id: Number(branch.id),
        delivery_charge: Number(deliveryCharge),
        discount: Number(discount) + Number(customBdtAmount),
        sub_total: Number(subtotal),
        sale_channel:
          (String(formData.get("saleChannel") || "OFFLINE").toUpperCase()),
      };

      const order = await tx.orders.create({ data: orderData as any });
      logger.info(`Order created: ${order.id}`);

      const orderItems = itemList.map((item: POSItem) => ({
        order_id: order.id,
        product_id: Number(item.productId),
        quantity: item.quantity,
        barcode: item.barcode,
        price: item.selling_price * item.quantity,
        cogs: Number(item.cost) * item.quantity,
        color_id: item.colorId ? Number(item.colorId) : null,
        size_id: item.sizeId ? Number(item.sizeId) : null,
      }));

      await tx.order_items.createMany({ data: orderItems as any[] });
      logger.info(`Items created`);

      for (const item of itemList) {
        const stocks = await tx.stocks.findMany({
          where: {
            product_id: BigInt(item.productId),
            branch_id: Number(branch.id),
            barcode: item.barcode,
            condition: "new"
          },
          orderBy: { created_at: "asc" }
        });

        const totalAvailable = stocks.reduce(
          (sum: number, stock: any) =>
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
            await tx.stocks.update({
              where: { id: stock.id },
              data: { quantity: newQuantity, updated_at: new Date() }
            });
          } else {
            await tx.stocks.delete({ where: { id: stock.id } });
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
    if (!branch?.id) {
      throw new Error("Branch is required for exchange checkout.");
    }

    await prisma.$transaction(async (tx) => {
      const customersData = {
        customer: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: toUpperCaseWords(String(formData.get("address"))),
      };

      const customerId = customerData?.customerId as number;

      await tx.customers.update({
        where: { id: customerId },
        data: customersData
      });
      const customer = await tx.customers.findUnique({ where: { id: customerId } });
      logger.info(`Customer updated: ${customer}`);

      const { calculateExgTotals, subExgTotal, deliveryCharge } =
        usePOSStore.getState();
      calculateExgTotals();
      if (!total) {
        throw new Error("Total cannot be 0");
      }

      const orderDataInput = {
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

      await tx.orders.update({
        where: { id: BigInt(ordersId) },
        data: orderDataInput as any
      });
      const updatedOrder = await tx.orders.findUnique({ where: { id: BigInt(ordersId) } });
      logger.info(`Order updated: ${updatedOrder?.id}`);

      for (const item of addExchangeItemList) {
        const existingStocks = await tx.stocks.findMany({
          where: {
            barcode: item.barcode,
            branch_id: Number(branch.id),
            condition: "new"
          },
          orderBy: { created_at: "asc" }
        });

        const totalAvailable = existingStocks.reduce(
          (sum: number, stock: any) =>
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
            await tx.stocks.update({
              where: { id: stock.id },
              data: { quantity: newQuantity, updated_at: new Date() }
            });
          } else {
            await tx.stocks.delete({ where: { id: stock.id } });
          }
        }

        const existingOrderItem = await tx.order_items.findFirst({
          where: {
            order_id: BigInt(ordersId),
            product_id: BigInt(item.productId ?? 0),
            barcode: item.barcode,
          }
        });

        if (existingOrderItem) {
          await tx.order_items.update({
            where: { id: existingOrderItem.id },
            data: {
              quantity: existingOrderItem.quantity + item.quantity,
              price:
                existingOrderItem.price + item.sellingPrice * item.quantity,
              updated_at: new Date(),
            }
          });
        } else {
          await tx.order_items.create({
            data: {
              order_id: BigInt(ordersId),
              product_id: BigInt(item.productId ?? 0),
              quantity: item.quantity,
              price: item.sellingPrice * item.quantity,
              barcode: item.barcode,
              color_id: item.colorId,
              size_id: item.sizeId,
              created_at: new Date(),
              updated_at: new Date(),
            } as any
          });
        }
      }

      for (const item of returnItemList) {
        const existingStock = await tx.stocks.findFirst({
          where: {
            barcode: item.barcode,
            branch_id: item.branchId,
          }
        });

        if (existingStock) {
          await tx.stocks.update({
            where: { id: existingStock.id },
            data: { quantity: Number(existingStock.quantity ?? 0) + item.quantity }
          });
        } else {
          await tx.stocks.create({
            data: {
              product_id: BigInt(item.productId ?? 0),
              branch_id: item.branchId,
              color_id: item.colorId,
              size_id: item.sizeId,
              barcode: item.barcode,
              cost: item.cost,
              quantity: item.quantity,
              created_at: new Date(),
              updated_at: new Date(),
            } as any
          });
        }

        const existingOrderItem = await tx.order_items.findFirst({
          where: {
            order_id: BigInt(ordersId),
            product_id: BigInt(item.productId ?? 0),
            barcode: item.barcode,
          }
        });

        if (existingOrderItem) {
          if (existingOrderItem.quantity > item.quantity) {
            await tx.order_items.update({
              where: { id: existingOrderItem.id },
              data: {
                quantity: existingOrderItem.quantity - item.quantity,
                updated_at: new Date(),
              }
            });
          } else {
            await tx.order_items.delete({ where: { id: existingOrderItem.id } });
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
