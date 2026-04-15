"use server";

import db from "@/db/database";
import { logger } from "@/lib/winston";
import {
  ensureSalesSchema,
  ensureSupplierPurchaseSchema,
  getSupplierById,
} from "@/services/supplier";
import { revalidatePath } from "next/cache";

type PaySupplierDuePayload = {
  amount: number;
  paymentMethod: string;
};

export async function paySupplierDue(
  supplierId: number,
  purchaseId: number,
  payload: PaySupplierDuePayload
) {
  await ensureSalesSchema();
  await ensureSupplierPurchaseSchema();

  const supplier = await getSupplierById(supplierId);

  if (!supplier) {
    throw new Error("Supplier not found.");
  }

  const amount = Number(payload.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount.");
  }

  const paymentMethod = String(payload.paymentMethod || "").trim();

  if (!paymentMethod) {
    throw new Error("Payment method is required.");
  }

  try {
    const updated = await db.transaction(async (trx) => {
      const purchase = await trx("stock_histories")
        .where({ id: purchaseId })
        .andWhere("supplier_name", supplier.name)
        .select(
          "id",
          "quantity",
          "cost_per_item",
          "paid_amount",
          "due_amount"
        )
        .first();

      if (!purchase) {
        throw new Error("Purchase entry not found for this supplier.");
      }

      const totalCost = Number(purchase.quantity) * Number(purchase.cost_per_item);
      const currentPaid = Number(purchase.paid_amount || 0);
      const currentDue =
        purchase.due_amount === null || purchase.due_amount === undefined
          ? Math.max(totalCost - currentPaid, 0)
          : Number(purchase.due_amount);

      if (currentDue <= 0) {
        throw new Error("This purchase has no due amount.");
      }

      if (amount > currentDue) {
        throw new Error("Payment amount cannot exceed current due.");
      }

      const newPaid = currentPaid + amount;
      const newDue = Math.max(currentDue - amount, 0);

      await trx("stock_histories").where({ id: purchaseId }).update({
        paid_amount: newPaid,
        due_amount: newDue,
        payment_method: paymentMethod,
        updated_at: new Date(),
      });

      return { paid_amount: newPaid, due_amount: newDue };
    });

    revalidatePath("/suppliers");
    revalidatePath(`/suppliers/${supplierId}`);

    return { status: "success" as const, data: updated };
  } catch (error) {
    logger.error(`Error in paySupplierDue: ${error}`);
    throw error;
  }
}
