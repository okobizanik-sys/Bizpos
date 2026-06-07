import prisma from "@/db/prisma";
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

// NOTE: ensureSupplierPurchaseSchema and ensureSalesSchema removed as schema is statically managed by Prisma.

export async function getSuppliers(): Promise<Supplier[]> {
  const suppliers = await prisma.suppliers.findMany({
    orderBy: { name: "asc" }
  });
  return suppliers as unknown as Supplier[];
}

export async function createSupplier(data: Supplier) {
  const supplier = await prisma.suppliers.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
    }
  });

  logger.info(`Supplier created successfully: ${supplier.id}`);
  return supplier;
}

export async function updateSupplier(id: number, data: Supplier) {
  const existingSupplier = await getSupplierById(id);

  if (!existingSupplier) {
    throw new Error("Supplier not found.");
  }

  const name = String(data.name || "").trim();

  if (!name) {
    throw new Error("Supplier name is required.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.suppliers.update({
      where: { id },
      data: {
        name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        updated_at: new Date(),
      }
    });

    if (existingSupplier.name !== name) {
      await tx.stock_histories.updateMany({
        where: { supplier_name: existingSupplier.name },
        data: {
          supplier_name: name,
          updated_at: new Date(),
        }
      });
    }
  });

  const supplier = await getSupplierById(id);
  logger.info(`Supplier updated successfully: ${supplier?.id}`);
  return supplier;
}

export async function deleteSupplier(id: number) {
  await prisma.$transaction(async (tx) => {
    await tx.orders.updateMany({
      where: { supplier_id: id },
      data: { supplier_id: null }
    });
    
    await tx.suppliers.delete({ where: { id } });
  });
  return 1;
}

export async function getSupplierById(id: number): Promise<Supplier | undefined> {
  const supplier = await prisma.suppliers.findFirst({ where: { id } });
  return (supplier as unknown as Supplier) || undefined;
}

export async function getSupplierPurchases(
  id: number,
  filters?: { from?: Date; to?: Date }
) {
  const supplier = await getSupplierById(id);

  if (!supplier) {
    return null;
  }

  let whereStr = "sh.supplier_name = ?";
  const queryParams: any[] = [supplier.name];

  if (filters?.from && filters?.to) {
    whereStr += " AND sh.created_at BETWEEN ? AND ?";
    queryParams.push(filters.from, filters.to);
  } else if (filters?.from) {
    whereStr += " AND sh.created_at >= ?";
    queryParams.push(filters.from);
  } else if (filters?.to) {
    whereStr += " AND sh.created_at <= ?";
    queryParams.push(filters.to);
  }

  const purchases = await prisma.$queryRawUnsafe<SupplierPurchaseRow[]>(
    `SELECT 
      sh.id,
      sh.created_at,
      sh.barcode,
      sh.variant,
      sh.quantity,
      sh.cost_per_item,
      sh.paid_amount,
      sh.due_amount,
      sh.payment_method,
      sh.product_date,
      sh.expire_date,
      sh.shelf_life,
      sh.supplier_name,
      p.name as productName,
      p.sku as productSku,
      c.name as categoryName
    FROM stock_histories sh
    LEFT JOIN products p ON sh.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr}
    ORDER BY sh.created_at DESC`,
    ...queryParams
  );

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
