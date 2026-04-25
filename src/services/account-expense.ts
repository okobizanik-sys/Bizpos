import db from "@/db/database";
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

export async function ensureAccountExpenseSchema() {
  const tableExists = await db.schema.hasTable("account_expenses");

  if (!tableExists) {
    await db.schema.createTable("account_expenses", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("category").notNullable();
      table.decimal("amount", 14, 2).notNullable().defaultTo(0);
      table.text("note").nullable();
      table.dateTime("date").notNullable();
      table.timestamps(true, true);
    });
    return;
  }

  const [hasTitle, hasCategory, hasAmount, hasNote, hasDate] = await Promise.all([
    db.schema.hasColumn("account_expenses", "title"),
    db.schema.hasColumn("account_expenses", "category"),
    db.schema.hasColumn("account_expenses", "amount"),
    db.schema.hasColumn("account_expenses", "note"),
    db.schema.hasColumn("account_expenses", "date"),
  ]);

  if (!hasTitle || !hasCategory || !hasAmount || !hasNote || !hasDate) {
    await db.schema.alterTable("account_expenses", (table) => {
      if (!hasTitle) table.string("title").notNullable().defaultTo("");
      if (!hasCategory) table.string("category").notNullable().defaultTo("Others");
      if (!hasAmount) table.decimal("amount", 14, 2).notNullable().defaultTo(0);
      if (!hasNote) table.text("note").nullable();
      if (!hasDate) table.dateTime("date").notNullable().defaultTo(db.fn.now());
    });
  }
}

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
  await ensureAccountExpenseSchema();

  const payload = {
    title: input.title.trim(),
    category: input.category,
    amount: input.amount,
    note: input.note?.trim() || null,
    date: input.date,
  };

  const inserted = await db("account_expenses").insert(payload);
  const createdId = Array.isArray(inserted) ? inserted[0] : inserted;
  const created = await db("account_expenses").where({ id: createdId }).first();

  return created ? normalizeExpense(created) : null;
}

export async function getAccountExpenses(
  filters: AccountExpenseFilters = {}
): Promise<AccountExpense[]> {
  await ensureAccountExpenseSchema();

  const query = db("account_expenses")
    .select("*")
    .orderBy("date", "desc")
    .orderBy("id", "desc");

  if (filters.category && filters.category !== "ALL") {
    query.where("category", filters.category);
  }

  const range = getAccountDateRange(
    filters.range || "ALL",
    filters.fromDate,
    filters.toDate
  );

  if (range) {
    query.andWhere("date", ">=", range.from).andWhere("date", "<=", range.to);
  }

  if (filters.limit) {
    query.limit(filters.limit);
  }

  const rows = await query;
  return rows.map(normalizeExpense);
}

export async function getAccountExpenseTotal(
  filters: Omit<AccountExpenseFilters, "category" | "limit"> = {}
) {
  await ensureAccountExpenseSchema();

  const query = db("account_expenses");
  const range = getAccountDateRange(
    filters.range || "ALL",
    filters.fromDate,
    filters.toDate
  );

  if (range) {
    query.andWhere("date", ">=", range.from).andWhere("date", "<=", range.to);
  }

  const row = await query.sum({ totalExpenses: "amount" }).first();
  return Number(row?.totalExpenses || 0);
}
