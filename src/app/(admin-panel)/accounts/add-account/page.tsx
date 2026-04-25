import Link from "next/link";
import { format } from "date-fns";
import { ReceiptText, Wallet } from "lucide-react";
import AccountForm from "./account-form";
import { formatAccountAmount } from "../account-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAccountExpenseTotal, getAccountExpenses } from "@/services/account-expense";

export const dynamic = "force-dynamic";

export default async function AddAccountPage() {
  const [recentEntries, allEntries, totalExpenses] = await Promise.all([
    getAccountExpenses({ limit: 6 }),
    getAccountExpenses(),
    getAccountExpenseTotal(),
  ]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit">
            Accounts Entry
          </Badge>
          <AccountForm />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/accounts/accounts-list">View accounts list</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-primary" />
                Expense summary
              </CardTitle>
              <CardDescription>These costs are now deducted from profit</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Total entries</p>
                <p className="mt-2 text-2xl font-semibold">{allEntries.length}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Total expense</p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatAccountAmount(totalExpenses)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ReceiptText className="h-5 w-5 text-primary" />
                Recent account activity
              </CardTitle>
              <CardDescription>Latest saved account entries from the database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentEntries.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                  No account entry added yet.
                </div>
              ) : (
                recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between gap-3 rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.category} | {format(new Date(entry.date), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatAccountAmount(entry.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}