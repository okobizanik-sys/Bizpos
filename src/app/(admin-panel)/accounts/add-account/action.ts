"use server";

import { revalidatePath } from "next/cache";

import {
  ACCOUNT_CATEGORIES,
  AccountCategory,
} from "../account-data";
import { createAccountExpense } from "@/services/account-expense";

export async function createAccountExpenseAction(input: {
  title: string;
  category: string;
  amount: number;
  note?: string;
  date: string;
}) {
  const category = input.category as AccountCategory;

  if (!ACCOUNT_CATEGORIES.includes(category)) {
    throw new Error("Invalid expense category.");
  }

  if (!input.title.trim()) {
    throw new Error("Expense title is required.");
  }

  if (!input.amount || input.amount <= 0) {
    throw new Error("Expense amount must be greater than zero.");
  }

  if (!input.date) {
    throw new Error("Expense date is required.");
  }

  await createAccountExpense({
    title: input.title,
    category,
    amount: input.amount,
    note: input.note,
    date: new Date(`${input.date}T00:00:00`),
  });

  revalidatePath("/accounts/add-account");
  revalidatePath("/accounts/accounts-list");
  revalidatePath("/admin/dashboard");
}
