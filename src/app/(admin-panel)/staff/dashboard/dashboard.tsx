"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBranch } from "@/hooks/store/use-branch";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { SalesData } from "@/types/shared";
import { formatDate } from "date-fns";
import { Download, ScrollText, ShoppingBag, TriangleAlert } from "lucide-react";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "zustand";
import { ProductWithStockPayload } from "../../inventories/stock-list/page";
import { getStocksByProduct } from "@/services/stock";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalesDashboardProps {
  salesData: SalesData[];
}

export default function StaffDashboard({ salesData }: SalesDashboardProps) {
  const branch = useStore(useBranch, (state) => state.branch);
  const { totalOrders, totalSales, calculateSalesTotals } = usePOSStore();
  const printerRef = React.useRef(null);
  const [stocks, setStocks] = React.useState<ProductWithStockPayload[]>([]);
  const [lowStocks, setLowStocks] = React.useState<ProductWithStockPayload[]>(
    []
  );

  React.useEffect(() => {
    if (branch) {
      getStocksByProduct({
        where: { branchId: Number(branch.id) },
      }).then((data) => {
        setStocks(data);
      });
    }
  }, [branch]);

  React.useEffect(() => {
    const findLowStocks = (stocks: ProductWithStockPayload[]) => {
      return stocks.reduce<ProductWithStockPayload[]>((acc, stock) => {
        if (stock.quantity < 5) {
          acc.push(stock);
        }
        return acc;
      }, []);
    };

    setLowStocks(findLowStocks(stocks));
  }, [stocks]);

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  React.useEffect(() => {
    calculateSalesTotals(salesData);
  }, [salesData, calculateSalesTotals]);

  // console.log(branches, "salesdata from dashboard");
  return (
    <div>
      <div className="flex gap-2 justify-end items-center mt-1 mr-4">
        <Button onClick={handlePrinter} className="text-xs h-6">
          <Download size={12} className="mr-2" /> Export
        </Button>
      </div>

      <div className="m-4 mt-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="flex items-end justify-between p-3 bg-gradient-to-tr from-[#654EDA] via-[#7B61FF] to-[#654EDA]">
          <CardHeader>
            <CardDescription className="text-white">Welcome To</CardDescription>
            <CardTitle className="text-white">{branch?.name}</CardTitle>
          </CardHeader>
          <div className="text-white">
            {formatDate(new Date().toString(), "MMMM dd")}
          </div>
        </Card>
        <Card className="flex items-center justify-start pl-6">
          <div className="bg-[#EAE5FF] rounded-sm h-8 w-8 flex justify-center items-center">
            <ScrollText size={20} color="#7B61FF" />
          </div>
          <CardHeader>
            <CardDescription className="">Total Sales</CardDescription>
            <CardTitle className="">৳ {totalSales}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex items-center justify-start pl-6">
          <div className="bg-[#DDFFE2] rounded-sm h-8 w-8 flex justify-center items-center">
            <ShoppingBag size={20} color="#29CC6A" />
          </div>
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle>{totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="p-3 md:col-span-2 xl:col-span-2">
          <div className="flex items-center justify-start gap-2">
            <div className="bg-[#FFEDDD] rounded-sm h-8 w-8 flex justify-center items-center">
              <TriangleAlert size={20} color="#FF961A" />
            </div>
            <Label>Low Stock Items</Label>
          </div>

          <Table className="rounded-lg overflow-hidden mt-4">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="h-8 text-white">SL</TableHead>
                <TableHead className="h-8 text-white">Barcode</TableHead>
                <TableHead className="h-8 text-white">Product Name</TableHead>
                <TableHead className="h-8 text-white">Variant</TableHead>
                <TableHead className="h-8 text-white">Category</TableHead>
                <TableHead className="h-8 text-white">Qty</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {lowStocks.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-2">{index + 1}</TableCell>
                  <TableCell className="py-2">{item.barcode}</TableCell>
                  <TableCell className="py-2 w-60">{item.name}</TableCell>
                  <TableCell className="py-2 w-60">
                    {item.colorName}-{item.sizeName}
                  </TableCell>
                  <TableCell className="py-2 w-60">
                    {item.categoryName}
                  </TableCell>
                  <TableCell className="py-2">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="hidden"></div>
    </div>
  );
}
