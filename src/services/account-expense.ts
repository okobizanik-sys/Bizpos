"use server";

import prisma from "@/db/prisma";
import {
  AccountCategory,
  AccountExpense,
  AccountRangeFilter,
  getAccountDateRange,
} from "@/app/(admin-panel)/accounts/account-data";

export type AccountExpenseFilters = {
  category?: string;
  range?: AccountRangeFilter;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
};

// NOTE: ensureAccountExpenseSchema has been removed because schema migrations 
// are now managed statically by Prisma (via \`prisma migrate\` or \`prisma db push\`).

const normalizeExpense = (row: any): AccountExpense => ({
  id: Number(row.id),
  title: String(row.title),
  category: row.category as AccountCategory,
  amount: Number(row.amount || 0),
  note: row.note || null,
  date: row.date,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export async function createAccountExpense(input: {
  title: string;
  category: AccountCategory;
  amount: number;
  note?: string;
  date: Date;
}) {
  const payload = {
    title: input.title.trim(),
    category: input.category,
    amount: input.amount,
    note: input.note?.trim() || null,
    date: input.date,
  };

  const created = await prisma.account_expenses.create({ data: payload });
  return created ? normalizeExpense(created) : null;
}

export async function getAccountExpenses(
  filters: AccountExpenseFilters = {}
): Promise<AccountExpense[]> {
  const where: any = {};

  if (filters.category && filters.category !== "ALL") {
    where.category = filters.category;
  }

  const range = getAccountDateRange(
    filters.range || "ALL",
    filters.fromDate,
    filters.toDate
  );

  if (range) {
    where.date = {
      gte: range.from,
      lte: range.to,
    };
  }

  const rows = await prisma.account_expenses.findMany({
    where,
    orderBy: [
      { date: "desc" },
      { id: "desc" }
    ],
    ...(filters.limit ? { take: filters.limit } : {})
  });

  return rows.map(normalizeExpense);
}

export async function getAccountExpenseTotal(
  filters: Omit<AccountExpenseFilters, "category" | "limit"> = {}
) {
  const where: any = {};

  const range = getAccountDateRange(
    filters.range || "ALL",
    filters.fromDate,
    filters.toDate
  );

  if (range) {
    where.date = {
      gte: range.from,
      lte: range.to,
    };
  }

  const row = await prisma.account_expenses.aggregate({
    _sum: { amount: true },
    where
  });

  return Number(row._sum.amount || 0);
}
