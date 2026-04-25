import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns";

export const ACCOUNT_CATEGORIES = [
  "House Rent",
  "Salary",
  "Utilities - Gas",
  "Utilities - Internet",
  "Utilities - Electricity",
  "Utilities - Water",
  "Security",
  "Entertainment",
  "Others",
] as const;

export type AccountCategory = (typeof ACCOUNT_CATEGORIES)[number];

export type AccountRangeFilter = "ALL" | "TODAY" | "WEEK" | "MONTH" | "CUSTOM";

export interface AccountExpense {
  id: number;
  category: AccountCategory;
  title: string;
  amount: number;
  note?: string | null;
  date: Date | string;
  created_at?: Date;
  updated_at?: Date;
}

export function formatAccountAmount(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getAccountDateRange(
  filter: AccountRangeFilter,
  from?: Date,
  to?: Date
) {
  const now = new Date();

  if (filter === "TODAY") {
    return { from: startOfDay(now), to: endOfDay(now) };
  }

  if (filter === "WEEK") {
    return {
      from: startOfWeek(now, { weekStartsOn: 1 }),
      to: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }

  if (filter === "MONTH") {
    return { from: startOfMonth(now), to: endOfMonth(now) };
  }

  if (filter === "CUSTOM" && from && to) {
    return { from: startOfDay(from), to: endOfDay(to) };
  }

  return null;
}
