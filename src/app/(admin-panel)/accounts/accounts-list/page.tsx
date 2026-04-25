import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, Filter, PlusCircle, WalletCards } from "lucide-react";

import {
  ACCOUNT_CATEGORIES,
  AccountExpense,
  AccountRangeFilter,
  formatAccountAmount,
  getAccountDateRange,
} from "../account-data";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAccountExpenses } from "@/services/account-expense";

export const dynamic = "force-dynamic";

const rangeOptions: { label: string; value: AccountRangeFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Today", value: "TODAY" },
  { label: "This Week", value: "WEEK" },
  { label: "This Month", value: "MONTH" },
  { label: "Custom Range", value: "CUSTOM" },
];

type Props = {
  searchParams: {
    range?: string;
    category?: string;
    fromDate?: string;
    toDate?: string;
  };
};

export default async function AccountsListPage({ searchParams }: Props) {
  const selectedRange = rangeOptions.some((item) => item.value === searchParams.range)
    ? (searchParams.range as AccountRangeFilter)
    : "TODAY";
  const selectedCategory = searchParams.category || "ALL";
  const fromDate = searchParams.fromDate || format(new Date(), "yyyy-MM-01");
  const toDate = searchParams.toDate || format(new Date(), "yyyy-MM-dd");
  const fromDateValue = fromDate ? new Date(fromDate) : undefined;
  const toDateValue = toDate ? new Date(toDate) : undefined;

  const filteredEntries = await getAccountExpenses({
    category: selectedCategory,
    range: selectedRange,
    fromDate: fromDateValue,
    toDate: toDateValue,
  });

  const totalAmount = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const totalsByCategory = ACCOUNT_CATEGORIES.map((category) => {
    const items = filteredEntries.filter((entry) => entry.category === category);
    return {
      category,
      count: items.length,
      total: items.reduce((sum, entry) => sum + entry.amount, 0),
    };
  }).filter((item) => item.count > 0);

  const activeRange = getAccountDateRange(selectedRange, fromDateValue, toDateValue);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="border-primary/20">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              Accounts Overview
            </Badge>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <WalletCards className="h-5 w-5 text-primary" />
              Accounts list by date
            </CardTitle>
            <CardDescription>
              Review expenses by today, week, month, or a custom date range.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/accounts/add-account">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add account
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="range">Quick range</Label>
              <select
                id="range"
                name="range"
                defaultValue={selectedRange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {rangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={selectedCategory}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="ALL">All categories</option>
                {ACCOUNT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromDate">From date</Label>
              <Input id="fromDate" name="fromDate" type="date" defaultValue={fromDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate">To date</Label>
              <Input id="toDate" name="toDate" type="date" defaultValue={toDate} />
            </div>

            <div className="flex items-end gap-2 md:col-span-2 xl:col-span-4">
              <Button type="submit">Apply filters</Button>
              <Button variant="outline" asChild>
                <Link href="/accounts/accounts-list">Reset</Link>
              </Button>
            </div>
          </form>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Filtered entries</p>
              <p className="mt-2 text-2xl font-semibold">{filteredEntries.length}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Total expense</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatAccountAmount(totalAmount)}
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Categories used</p>
              <p className="mt-2 text-2xl font-semibold">{totalsByCategory.length}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Active window</p>
              <p className="mt-2 text-sm font-medium">
                {activeRange
                  ? `${format(activeRange.from, "dd MMM yyyy")} - ${format(
                      activeRange.to,
                      "dd MMM yyyy"
                    )}`
                  : "All available dates"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Category summary
            </CardTitle>
            <CardDescription>A quick breakdown of spending by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalsByCategory.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No account entries were found for the selected range.
              </div>
            ) : (
              totalsByCategory.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-muted-foreground">{item.count} item</p>
                  </div>
                  <p className="font-semibold">{formatAccountAmount(item.total)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Expense details
            </CardTitle>
            <CardDescription>See which expenses were added on which dates</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No expense found for the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry: AccountExpense) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.title}</TableCell>
                      <TableCell>{entry.category}</TableCell>
                      <TableCell>{format(new Date(entry.date), "dd MMM yyyy")}</TableCell>
                      <TableCell className="max-w-[240px] truncate text-muted-foreground">
                        {entry.note || "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatAccountAmount(entry.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
