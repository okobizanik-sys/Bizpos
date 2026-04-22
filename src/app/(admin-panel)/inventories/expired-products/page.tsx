import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getExpiredStocks } from "@/services/stock";
import { makeBDPrice } from "@/utils/helpers";

export const revalidate = 0;

export default async function ExpiredProductsPage() {
  const expiredStocks = await getExpiredStocks({
    where: {},
    distinct: ["barcode"],
  });

  return (
    <ContentLayout title="Expired Products">
      <Card className="rounded-lg p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">All Branch Expired Products</h2>
          <span className="text-xs text-muted-foreground">
            Total Results: {expiredStocks.length}
          </span>
        </div>

        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="h-8 text-white">Branch</TableHead>
              <TableHead className="h-8 text-white">Barcode</TableHead>
              <TableHead className="h-8 text-white">Product</TableHead>
              <TableHead className="h-8 text-white">Category</TableHead>
              <TableHead className="h-8 text-white">Variant</TableHead>
              <TableHead className="h-8 text-white">Expire Date</TableHead>
              <TableHead className="h-8 text-white">Qty</TableHead>
              <TableHead className="h-8 text-white">Stock Value</TableHead>
              <TableHead className="h-8 text-white">Sell Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expiredStocks.length > 0 ? (
              expiredStocks.map((item) => (
                <TableRow key={`${item.branchId}-${item.barcode}`}>
                  <TableCell>{item.branchName || "-"}</TableCell>
                  <TableCell>{item.barcode}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.categoryName || "-"}</TableCell>
                  <TableCell>
                    {item.colorName || "-"} - {item.sizeName || "-"}
                  </TableCell>
                  <TableCell>{String(item.expire_date || "-")}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {makeBDPrice(Number(item.quantity) * Number(item.cost || 0))}
                  </TableCell>
                  <TableCell>
                    {makeBDPrice(
                      Number(item.quantity) * Number(item.selling_price || 0)
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No expired products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </ContentLayout>
  );
}
