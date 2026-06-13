"use client";

import { Label } from "@radix-ui/react-label";
import React, { FormEvent } from "react";
import { StockSelector } from "../stock-transfer/transfer-products/stock-selector";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PlusSquare,
  Printer,
  QrCode,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { useBranch } from "@/hooks/store/use-branch";
import { getDamagedStocks, getStocks, getStocksCount } from "@/services/stock";
import { StockPayload } from "../stock-transfer/transfer-products/transfer-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTotalFromTable, makePrice } from "@/utils/helpers";
import { DamageProductForm } from "./action";
import { useStore } from "zustand";
import { useToast } from "@/components/ui/use-toast";
import { POSItem } from "../pos/item-selector";
import { useReactToPrint } from "react-to-print";
import DamageProductSlip from "@/components/print-pages/damaged-product-slip";
import { Card } from "@/components/ui/card";

interface DamageProductsTableProps {
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}

export default function DamageProductsTable({
  search,
  fromDate,
  toDate,
}: DamageProductsTableProps) {
  const branch = useStore(useBranch, (state) => state.branch);
  const { itemList, addItem, removeItem, setOrderId, updateItemQty } =
    usePOSStore();

  const [stocks, setStocks] = React.useState<StockPayload[]>([]);
  const [damagedStocks, setDamagedStocks] = React.useState<POSItem[]>([]);
  const [selectedBarcode, setSelectedBarcode] = React.useState<string | null>(
    null,
  );
  const [qtyLimit, setQtyLimit] = React.useState<number>(0);
  const [selectedQty, setSelectedQty] = React.useState<number>(0);
  const [qtyModalOpen, setQtyModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const printerRef = React.useRef(null);

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  React.useEffect(() => {
    if (branch) {
      getStocks({
        where: { branch_id: branch.id },
        distinct: ["barcode"],
      }).then((data) => {
        setStocks(data);
      });

      getDamagedStocks({
        where: { branch_id: branch.id },
        distinct: ["barcode"],
      }).then((data) => {
        setDamagedStocks(data);
      });
    }
  }, [branch]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, fromDate, toDate, branch]);

  const filteredDamagedStocks = React.useMemo(() => {
    return damagedStocks.filter((item: any) => {
      let match = true;

      if (search) {
        const q = search.toLowerCase();
        match =
          match &&
          (item.barcode?.toLowerCase().includes(q) ||
            item.name?.toLowerCase().includes(q) ||
            item.categoryName?.toLowerCase().includes(q) ||
            item.branchName?.toLowerCase().includes(q));
      }

      if (fromDate) {
        const created = item.created_at ? new Date(item.created_at) : null;
        if (created) match = match && created >= fromDate;
      }

      if (toDate) {
        const created = item.created_at ? new Date(item.created_at) : null;
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (created) match = match && created <= endOfDay;
      }

      return match;
    });
  }, [damagedStocks, search, fromDate, toDate]);

  const totalItems = filteredDamagedStocks.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedDamagedStocks = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDamagedStocks.slice(startIndex, startIndex + pageSize);
  }, [filteredDamagedStocks, currentPage, pageSize]);

  const barcodeSelected = (code: string | null | void) => {
    if (code) {
      setSelectedBarcode(code);
      getStocksCount({
        where: { barcode: code, branch_id: branch?.id },
      }).then((data) => {
        const itemInList = itemList.find((item) => item.barcode === code);
        setQtyLimit(itemInList ? data - itemInList.quantity : data);
      });
      const stock = stocks.find((stock) => stock.barcode === code);
      if (stock) {
        addItem({
          id: stock.id,
          barcode: stock.barcode,
          productId: stock.productId,
          name: stock.name,
          colorId: stock.color_id,
          colorName: stock.colorName || "-",
          sizeId: stock.size_id,
          sizeName: stock.sizeName || "-",
          quantity: 1,
          selling_price: stock.selling_price,
          categoryName: stock.categoryName,
          sku: stock.sku,
          cost: stock.cost,
          condition: stock.condition,
        });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      await DamageProductForm(branch, itemList);

      const updatedDamagedStocks = await getDamagedStocks({
        where: { branch_id: branch.id },
      });
      setDamagedStocks(updatedDamagedStocks);

      toast({
        title: "Damaged product added successfully",
        description: `Damaged product has been added successfully`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to add damaged product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totals = React.useMemo(() => {
    return filteredDamagedStocks.reduce(
      (acc: any, item) => {
        acc.stockValue += Number(item.cost || 0) * Number(item.quantity || 0);
        acc.sellValue +=
          Number(item.selling_price || 0) * Number(item.quantity || 0);
        acc.totalQty += Number(item.quantity || 0);
        return acc;
      },
      { stockValue: 0, sellValue: 0, totalQty: 0 },
    );
  }, [filteredDamagedStocks]);

  return (
    <>
      <Card className="m-4 p-4 rounded-lg">
        <div className="w-1/2 relative">
          <Label>Add Damaged Products</Label>
          <StockSelector
            stocks={stocks}
            setSelectedStock={barcodeSelected}
            qtyLimit={qtyLimit}
          />
          <QrCode className="opacity-60 absolute right-8 -translate-y-8" />
        </div>
      </Card>

      {itemList.length > 0 && (
        <Card className=" m-4 p-4 overflow-scroll no-scrollbar ">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="h-8 text-white">SL</TableHead>
                <TableHead className="h-8 text-white">Item Code</TableHead>
                <TableHead className="h-8 text-white">Barcode</TableHead>
                <TableHead className="h-8 text-white">Product Name</TableHead>
                <TableHead className="h-8 text-white">Category</TableHead>
                <TableHead className="h-8 text-white">SKU</TableHead>
                <TableHead className="h-8 text-white">Stock Value</TableHead>
                <TableHead className="h-8 text-white">Sell Value</TableHead>
                <TableHead className="h-8 text-white">Qty</TableHead>
                <TableHead className="h-8 text-white"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {itemList.map((item, index) => (
                <TableRow key={item.barcode}>
                  <TableCell className="py-2">{index + 1}</TableCell>
                  <TableCell className="py-2">{item.productId}</TableCell>
                  <TableCell className="py-2">{item.barcode}</TableCell>
                  <TableCell className="py-2 w-60">{item.name}</TableCell>
                  <TableCell className="py-2 w-60">
                    {item.categoryName}
                  </TableCell>
                  <TableCell className="py-2 w-60">{item.sku}</TableCell>
                  <TableCell className="py-2 w-60">
                    {Number(item.quantity) * Number(item.cost)}
                  </TableCell>
                  <TableCell className="py-2">
                    {Number(item.quantity) * Number(item.selling_price)}
                  </TableCell>
                  <TableCell className="py-2 w-20 flex gap-2 items-center">
                    <Input
                      type="number"
                      max={qtyLimit}
                      min={1}
                      value={item.quantity}
                      required
                      onChange={(e) =>
                        updateItemQty(
                          item.barcode,
                          parseInt(e.target.value, 10) || 1,
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="w-8">
                    <Button
                      size="icon"
                      className="w-6 h-6 rounded-full bg-red-200 hover:bg-red-600 text-red-600 hover:text-white"
                      onClick={() => removeItem(item.barcode)}
                    >
                      <Trash2 className="" size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <form
            onSubmit={handleSubmit}
            className="mt-3 w-full flex justify-center"
          >
            <Button type="submit" variant="default" loading={loading}>
              <PlusSquare />
              Add to Damaged Products
            </Button>
          </form>
        </Card>
      )}

      <Card className=" m-4 p-4 rounded-lg overflow-scroll no-scrollbar ">
        <div className="flex gap-2 justify-end items-center my-1">
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-blue-400 text-blue-400 w-8 h-8"
            onClick={handlePrinter}
          >
            <Printer />
          </Button>
        </div>
        <Label>Damaged Porducts List</Label>
        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="h-8 text-white">SL</TableHead>
              <TableHead className="h-8 text-white">Barcode</TableHead>
              <TableHead className="h-8 text-white">Product Name</TableHead>
              <TableHead className="h-8 text-white">Category</TableHead>
              <TableHead className="h-8 text-white">Stock Value</TableHead>
              <TableHead className="h-8 text-white">Sell Value</TableHead>
              <TableHead className="h-8 text-white">Qty</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedDamagedStocks.length > 0 ? (
              paginatedDamagedStocks.map((item, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index + 1;
                return (
                  <TableRow key={item.id || item.barcode || index}>
                    <TableCell className="py-2">{globalIndex}</TableCell>
                    <TableCell className="py-2">{item.barcode}</TableCell>
                    <TableCell className="py-2 w-60">{item.name}</TableCell>
                    <TableCell className="py-2 w-60">{item.categoryName}</TableCell>
                    <TableCell className="py-2 w-60">
                      {Number(item.cost || 0) * Number(item.quantity || 0)}
                    </TableCell>
                    <TableCell className="py-2">
                      {Number(item.selling_price || 0) * Number(item.quantity || 0)}
                    </TableCell>
                    <TableCell className="py-2 w-20 flex gap-2 items-center">
                      {item.quantity}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No damaged products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right">
                Totals:
              </TableCell>
              <TableCell>{totals.stockValue}</TableCell>
              <TableCell>{totals.sellValue}</TableCell>
              <TableCell>{totals.totalQty}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-3 sm:flex-row sm:gap-8 mt-4 border-t">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8 w-full justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              Total {totalItems} items
            </div>
            <div className="flex items-center space-x-2">
              <Button
                aria-label="Go to first page"
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to previous page"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                aria-label="Go to next page"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to last page"
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rows per page</span>
              <Select
                onValueChange={(value) => {
                  setPageSize(parseInt(value, 10));
                  setCurrentPage(1);
                }}
                value={pageSize.toString()}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 30, 40, 50, 100].map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="hidden">
        <DamageProductSlip
          damagedStocks={filteredDamagedStocks}
          existingBranch={branch}
          ref={printerRef}
        />
      </div>
    </>
  );
}
