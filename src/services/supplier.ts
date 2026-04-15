import db from "@/db/database";
import { logger } from "@/lib/winston";
import type { Supplier } from "@/types/shared";

type SupplierPurchaseRow = {
  id: number;
  created_at: Date;
  barcode: string;
  variant: string | null;
  quantity: number;
  cost_per_item: number;
  paid_amount: number | null;
  due_amount: number | null;
  payment_method?: string | null;
  product_date?: Date | null;
  expire_date?: Date | null;
  shelf_life?: number | null;
  supplier_name?: string | null;
  productName?: string | null;
  productSku?: string | null;
  categoryName?: string | null;
};

type SupplierPurchaseSummary = {
  totalPurchaseAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  totalItems: number;
};

export async function ensureSupplierPurchaseSchema() {
  const [
    hasSupplierName,
    hasProductDate,
    hasShelfLife,
    hasExpireDate,
    hasPaidAmount,
    hasDueAmount,
    hasPaymentMethod,
  ] = await Promise.all([
    db.schema.hasColumn("stock_histories", "supplier_name"),
    db.schema.hasColumn("stock_histories", "product_date"),
    db.schema.hasColumn("stock_histories", "shelf_life"),
    db.schema.hasColumn("stock_histories", "expire_date"),
    db.schema.hasColumn("stock_histories", "paid_amount"),
    db.schema.hasColumn("stock_histories", "due_amount"),
    db.schema.hasColumn("stock_histories", "payment_method"),
  ]);

  if (
    !hasSupplierName ||
    !hasProductDate ||
    !hasShelfLife ||
    !hasExpireDate ||
    !hasPaidAmount ||
    !hasDueAmount ||
    !hasPaymentMethod
  ) {
    await db.schema.alterTable("stock_histories", function (table) {
      if (!hasSupplierName) table.string("supplier_name").nullable();
      if (!hasProductDate) table.date("product_date").nullable();
      if (!hasShelfLife) table.integer("shelf_life").nullable();
      if (!hasExpireDate) table.date("expire_date").nullable();
      if (!hasPaidAmount) table.float("paid_amount").nullable();
      if (!hasDueAmount) table.float("due_amount").nullable();
      if (!hasPaymentMethod) table.string("payment_method").nullable();
    });
  }
}

export async function ensureSalesSchema() {
  const suppliersTableExists = await db.schema.hasTable("suppliers");

  if (!suppliersTableExists) {
    await db.schema.createTable("suppliers", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").nullable();
      table.string("phone").nullable();
      table.text("address").nullable();
      table.timestamps(true, true);
    });
  }

  if (suppliersTableExists) {
    const hasEmail = await db.schema.hasColumn("suppliers", "email");

    if (!hasEmail) {
      await db.schema.alterTable("suppliers", function (table) {
        table.string("email").nullable();
      });
    }
  }

  const [hasSaleChannel, hasSupplierId] = await Promise.all([
    db.schema.hasColumn("orders", "sale_channel"),
    db.schema.hasColumn("orders", "supplier_id"),
  ]);

  if (!hasSaleChannel || !hasSupplierId) {
    await db.schema.alterTable("orders", function (table) {
      if (!hasSaleChannel) {
        table.string("sale_channel").notNullable().defaultTo("OFFLINE");
      }
      if (!hasSupplierId) {
        table.integer("supplier_id").unsigned().nullable();
      }
    });
  }
}

export async function getSuppliers(): Promise<Supplier[]> {
  await ensureSalesSchema();

  return db("suppliers").select("*").orderBy("name", "asc");
}

export async function createSupplier(data: Supplier) {
  await ensureSalesSchema();

  const [insertResult] = await db("suppliers").insert({
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
  });

  const [supplier] = await db("suppliers").where({ id: insertResult });
  logger.info(`Supplier created successfully: ${supplier.id}`);
  return supplier;
}

export async function deleteSupplier(id: number) {
  await ensureSalesSchema();

  await db("orders").where({ supplier_id: id }).update({ supplier_id: null });
  return db("suppliers").where({ id }).delete();
}

export async function getSupplierById(id: number): Promise<Supplier | undefined> {
  await ensureSalesSchema();

  return db("suppliers").where({ id }).first();
}

export async function getSupplierPurchases(
  id: number,
  filters?: { from?: Date; to?: Date }
) {
  await ensureSalesSchema();
  await ensureSupplierPurchaseSchema();

  const supplier = await getSupplierById(id);

  if (!supplier) {
    return null;
  }

  const purchases = (await db("stock_histories")
    .leftJoin("products", "stock_histories.product_id", "products.id")
    .leftJoin("categories", "products.category_id", "categories.id")
    .select(
      "stock_histories.id",
      "stock_histories.created_at",
      "stock_histories.barcode",
      "stock_histories.variant",
      "stock_histories.quantity",
      "stock_histories.cost_per_item",
      "stock_histories.paid_amount",
      "stock_histories.due_amount",
      "stock_histories.payment_method",
      "stock_histories.product_date",
      "stock_histories.expire_date",
      "stock_histories.shelf_life",
      "stock_histories.supplier_name",
      "products.name as productName",
      "products.sku as productSku",
      "categories.name as categoryName"
    )
    .where("stock_histories.supplier_name", supplier.name)
    .modify((query) => {
      if (filters?.from && filters?.to) {
        query.whereBetween("stock_histories.created_at", [filters.from, filters.to]);
      } else if (filters?.from) {
        query.where("stock_histories.created_at", ">=", filters.from);
      } else if (filters?.to) {
        query.where("stock_histories.created_at", "<=", filters.to);
      }
    })
    .orderBy("stock_histories.created_at", "desc")) as SupplierPurchaseRow[];

  const summary = purchases.reduce(
    (acc: SupplierPurchaseSummary, item: SupplierPurchaseRow) => {
      const totalCost = Number(item.quantity) * Number(item.cost_per_item);
      const paidAmount = Number(item.paid_amount || 0);
      const dueAmount =
        item.due_amount === null || item.due_amount === undefined
          ? Math.max(totalCost - paidAmount, 0)
          : Number(item.due_amount);

      acc.totalPurchaseAmount += totalCost;
      acc.totalPaidAmount += paidAmount;
      acc.totalDueAmount += dueAmount;
      acc.totalItems += Number(item.quantity || 0);
      return acc;
    },
    {
      totalPurchaseAmount: 0,
      totalPaidAmount: 0,
      totalDueAmount: 0,
      totalItems: 0,
    } as SupplierPurchaseSummary
  );

  return {
    supplier,
    purchases: purchases.map((item: SupplierPurchaseRow) => ({
      ...item,
      total_cost: Number(item.quantity) * Number(item.cost_per_item),
      paid_amount: Number(item.paid_amount || 0),
      due_amount:
        item.due_amount === null || item.due_amount === undefined
          ? Math.max(
              Number(item.quantity) * Number(item.cost_per_item) -
                Number(item.paid_amount || 0),
              0
            )
          : Number(item.due_amount),
    })),
    summary,
  };
}
