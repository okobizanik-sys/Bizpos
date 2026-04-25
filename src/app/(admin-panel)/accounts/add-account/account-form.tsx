"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { useState, useTransition } from "react";

import { createAccountExpenseAction } from "./action";
import { ACCOUNT_CATEGORIES, AccountCategory } from "../account-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const defaultForm = {
  title: "",
  category: "House Rent" as AccountCategory,
  amount: "",
  date: format(new Date(), "yyyy-MM-dd"),
  note: "",
};

const quickSuggestions = [
  "Monthly office rent",
  "Staff salary",
  "Gas bill",
  "Internet bill",
  "Electricity bill",
  "Water bill",
  "Security payment",
  "Entertainment expense",
];

export default function AccountForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await createAccountExpenseAction({
          title: form.title,
          category: form.category,
          amount: Number(form.amount),
          note: form.note,
          date: form.date,
        });

        setForm(defaultForm);
        router.refresh();
        toast({
          title: "Account expense added",
          description: "This expense will now be deducted from dashboard profit.",
        });
      } catch (error) {
        toast({
          title: "Could not save expense",
          description:
            error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <PlusCircle className="h-5 w-5 text-primary" />
          Add account expense
        </CardTitle>
        <CardDescription>
          Add business expenses here. These costs will be subtracted from profit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Expense title</Label>
              <Input
                id="title"
                placeholder="e.g. April house rent"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value: AccountCategory) =>
                  setForm((current) => ({ ...current, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Expense date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Optional note..."
              value={form.note}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Quick ideas</Label>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full border px-3 py-1 text-xs transition hover:bg-muted"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      title: current.title || item,
                    }))
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
