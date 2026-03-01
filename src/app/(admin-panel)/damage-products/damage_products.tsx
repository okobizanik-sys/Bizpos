"use client";

import { Label } from "@radix-ui/react-label";
import React, { FormEvent } from "react";
import { StockSelector } from "../stock-transfer/transfer-products/stock-selector";
import { PlusSquare, Printer, QrCode, Trash2 } from "lucide-react";
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

export default function DamageProducts() {
  const branch = useStore(useBranch, (state) => state.branch);
  const { itemList, addItem, removeItem, setOrderId, updateItemQty } =
    usePOSStore();

  const [stocks, setStocks] = React.useState<StockPayload[]>([]);
  const [damagedStocks, setDamagedStocks] = React.useState<POSItem[]>([]);
  const [selectedBarcode, setSelectedBarcode] = React.useState<string | null>(
    null
  );
  const [qtyLimit, setQtyLimit] = React.useState<number>(0);
  const [selectedQty, setSelectedQty] = React.useState<number>(0);
  const [qtyModalOpen, setQtyModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const printerRef = React.useRef(null);

  // const handleExportToCsv = () => {
  //   const headers = table
  //     .getHeaderGroups()
  //     .map((x) => x.headers)
  //     .flat();

  //   const rows = table.getRowModel().rows;

  //   exportToCsv("stock-list-" + format(new Date(), "YMdHHmmss"), headers, rows);
  // };

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
  });

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

  // console.log("damagedStocks from damaged products:", damagedStocks);
  // console.log("Stocks from  products:", stocks);

  // const addStockToItemList = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const stock = stocks.find((stock) => stock.barcode === selectedBarcode);
  //   if (stock) {
  //     // if (itemList.length === 0) {
  //     //   setOrderId();
  //     // }
  //     addItem({
  //       id: stock.id,
  //       barcode: stock.barcode,
  //       productId: stock.productId,
  //       name: stock.name,
  //       colorId: stock.color_id,
  //       colorName: stock.colorName || "-",
  //       sizeId: stock.size_id,
  //       sizeName: stock.sizeName || "-",
  //       quantity: selectedQty,
  //       selling_price: stock.selling_price,
  //       categoryName: stock.categoryName,
  //       sku: stock.sku,
  //       cost: stock.cost,
  //       condition: stock.condition,
  //     });
  //     setSelectedQty(0);
  //     setQtyModalOpen(false);
  //   }
  // };

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
        // setSelectedQty(0);
        // setQtyModalOpen(false);
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
        // distinct: ["barcode"],
      });
      setDamagedStocks(updatedDamagedStocks);

      toast({
        title: "Damaged product added successfully",
        description: `Damaged product has been added successfully`,
        variant: "default",
      });
    } catch (error: any) {
      // console.error(error);

      toast({
        title: "Failed to add damaged product",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const totals = damagedStocks.reduce(
    (acc: any, item) => {
      acc.stockValue += Number(item.cost || 0);
      acc.sellValue += Number(item.selling_price || 0);
      acc.totalQty += Number(item.quantity || 0);
      return acc;
    },
    { stockValue: 0, sellValue: 0, totalQty: 0 }
  );

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
                          parseInt(e.target.value, 10) || 1
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
          {/* <Button
            variant="outline"
            size="icon"
            className="border-2 border-green-400 text-green-400 w-8 h-8"
            onClick={handleExportToCsv}
          >
            <FileSpreadsheet />
          </Button> */}
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
              {/* <TableHead className="h-8 text-white">Item Code</TableHead> */}
              <TableHead className="h-8 text-white">Barcode</TableHead>
              <TableHead className="h-8 text-white">Product Name</TableHead>
              <TableHead className="h-8 text-white">Category</TableHead>
              {/* <TableHead className="h-8 text-white">SKU</TableHead> */}
              <TableHead className="h-8 text-white">Stock Value</TableHead>
              <TableHead className="h-8 text-white">Sell Value</TableHead>
              <TableHead className="h-8 text-white">Qty</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {damagedStocks.map((item, index) => (
              <TableRow key={item.barcode}>
                <TableCell className="py-2">{index + 1}</TableCell>
                {/* <TableCell className="py-2">{item.productId}</TableCell> */}
                <TableCell className="py-2">{item.barcode}</TableCell>
                <TableCell className="py-2 w-60">{item.name}</TableCell>
                <TableCell className="py-2 w-60">{item.categoryName}</TableCell>
                {/* <TableCell className="py-2 w-60">{item.sku}</TableCell> */}
                <TableCell className="py-2 w-60">{Number(item.cost)}</TableCell>
                <TableCell className="py-2">
                  {Number(item.selling_price)}
                </TableCell>
                <TableCell className="py-2 w-20 flex gap-2 items-center">
                  {item.quantity}
                </TableCell>
              </TableRow>
            ))}
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
      </Card>

      {/* Dialogue box */}
      {/* <Dialog open={qtyModalOpen} onOpenChange={setQtyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Quantity (In Stock: {qtyLimit})</DialogTitle>
          </DialogHeader>
          <form onSubmit={addStockToItemList} className="flex gap-2">
            <Input
              className="w-[200px]"
              type="number"
              max={qtyLimit}
              min={1}
              value={selectedQty}
              required
              onChange={(e) => setSelectedQty(parseInt(e.target.value))}
            />
            <Button className="flex-1" type="submit">
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog> */}

      <div className="hidden">
        <DamageProductSlip
          damagedStocks={damagedStocks}
          existingBranch={branch}
          ref={printerRef}
        />
      </div>
    </>
  );
}
