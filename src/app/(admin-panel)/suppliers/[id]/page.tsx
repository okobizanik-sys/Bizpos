import Link from "next/link";
import { notFound } from "next/navigation";
import { endOfDay, format, isValid, startOfDay } from "date-fns";
import { Navbar } from "@/components/admin-panel/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSupplierPurchases } from "@/services/supplier";
import { makeBDPrice } from "@/utils/helpers";
import SupplierPayDueDialog from "./pay-due-dialog";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    from_date?: string | string[];
    to_date?: string | string[];
  };
}

export const revalidate = 0;

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilterDate(value?: string, endOfRange?: boolean) {
  if (!value) return undefined;

  const date = new Date(value);

  if (!isValid(date)) {
    return undefined;
  }

  return endOfRange ? endOfDay(date) : startOfDay(date);
}

export default async function SupplierProfilePage({
  params,
  searchParams,
}: Props) {
  const supplierId = Number(params.id);

  if (Number.isNaN(supplierId)) {
    notFound();
  }

  const fromDateValue = getSearchParamValue(searchParams.from_date);
  const toDateValue = getSearchParamValue(searchParams.to_date);

  const result = await getSupplierPurchases(supplierId, {
    from: parseFilterDate(fromDateValue),
    to: parseFilterDate(toDateValue, true),
  });

  if (!result) {
    notFound();
  }

  const { supplier, purchases, summary } = result;

  const supplierPrimaryId = supplier.id;

  if (!supplierPrimaryId) {
    notFound();
  }

  return (
    <>
      <Navbar title={`${supplier.name} Profile`} />

      <div className="m-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{supplier.name}</h2>
            <p className="text-sm text-muted-foreground">
              Date wise purchases, payment, due, and supplier details.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/suppliers">Back to Suppliers</Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-4 lg:col-span-1">
            <h3 className="text-lg font-semibold">Supplier Info</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {supplier.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {supplier.email || "No email"}
              </p>
              <p>
                <span className="font-medium">Mobile:</span>{" "}
                {supplier.phone || "No mobile"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {supplier.address || "No address"}
              </p>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Purchase Entries</p>
              <p className="mt-2 text-2xl font-semibold">{purchases.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Items Bought</p>
              <p className="mt-2 text-2xl font-semibold">
                {summary.totalItems}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="mt-2 text-2xl font-semibold">
                {makeBDPrice(summary.totalPaidAmount)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Due Amount</p>
              <p className="mt-2 text-2xl font-semibold">
                {makeBDPrice(summary.totalDueAmount)}
              </p>
            </Card>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Date Wise Purchase List</h3>
              <p className="text-sm text-muted-foreground">
                See which items were purchased on which date, with payment and
                due.
              </p>
            </div>

            <form className="flex flex-wrap items-end gap-2" method="get">
              <div className="space-y-1">
                <label className="text-xs font-medium">From Date</label>
                <Input
                  defaultValue={fromDateValue || ""}
                  name="from_date"
                  type="date"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">To Date</label>
                <Input
                  defaultValue={toDateValue || ""}
                  name="to_date"
                  type="date"
                />
              </div>
              <Button type="submit">Filter</Button>
              <Button asChild type="button" variant="outline">
                <Link href={`/suppliers/${supplierPrimaryId}`}>Reset</Link>
              </Button>
            </form>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table className="rounded-lg overflow-hidden">
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="h-8 text-white">Date</TableHead>
                  <TableHead className="h-8 text-white">Product</TableHead>
                  <TableHead className="h-8 text-white">SKU</TableHead>
                  <TableHead className="h-8 text-white">Variant</TableHead>
                  <TableHead className="h-8 text-white">Qty</TableHead>
                  <TableHead className="h-8 text-white">Cost</TableHead>
                  <TableHead className="h-8 text-white">Total</TableHead>
                  <TableHead className="h-8 text-white">Paid</TableHead>
                  <TableHead className="h-8 text-white">Due</TableHead>
                  <TableHead className="h-8 text-white">Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.length ? (
                  purchases.map((purchase: (typeof purchases)[number]) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="py-2">
                        {purchase.created_at
                          ? format(new Date(purchase.created_at), "dd/MM/yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="py-2">
                        {purchase.productName || "-"}
                      </TableCell>
                      <TableCell className="py-2">
                        {purchase.productSku || "-"}
                      </TableCell>
                      <TableCell className="py-2">
                        {purchase.variant || "-"}
                      </TableCell>
                      <TableCell className="py-2">
                        {purchase.quantity}
                      </TableCell>
                      <TableCell className="py-2">
                        {makeBDPrice(purchase.cost_per_item)}
                      </TableCell>
                      <TableCell className="py-2">
                        {makeBDPrice(purchase.total_cost)}
                      </TableCell>
                      <TableCell className="py-2">
                        {makeBDPrice(purchase.paid_amount)}
                      </TableCell>
                      <TableCell className="py-2">
                        {makeBDPrice(purchase.due_amount)}
                      </TableCell>
                      <TableCell className="py-2">
                        {purchase.due_amount <= 0 ? (
                          <div className="text-green-500 font-medium">
                            Completed Payment
                          </div>
                        ) : (
                          <SupplierPayDueDialog
                            supplierId={supplierPrimaryId}
                            purchaseId={purchase.id}
                            dueAmount={purchase.due_amount}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="h-24 text-center" colSpan={10}>
                      No purchase history found for this supplier.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="font-medium">
              Total Purchase: {makeBDPrice(summary.totalPurchaseAmount)}
            </span>
            <span className="font-medium">
              Total Paid: {makeBDPrice(summary.totalPaidAmount)}
            </span>
            <span className="font-medium">
              Total Due: {makeBDPrice(summary.totalDueAmount)}
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
