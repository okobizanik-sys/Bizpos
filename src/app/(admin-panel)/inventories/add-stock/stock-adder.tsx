"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { ProductSelector } from "./product-selector";
import {
  getProduct,
  getProducts,
  getSelectedProduct,
} from "@/services/product";
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
import { fileUrlGenerator, makePrice, makeProductCode } from "@/utils/helpers";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, SendHorizontal, X } from "lucide-react";
import { addStockFormAction } from "./action";
import { useToast } from "@/components/ui/use-toast";
import { ProductList } from "../products/columns";
import { Colors, Sizes } from "@/types/shared";
import { getColors, getProductColors } from "@/services/color";
import { getProductSizes, getSizes } from "@/services/size";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "zustand";
import { Card } from "@/components/ui/card";

export type TStockRow = {
  barcode: string;
  colorId: string;
  sizeId: string;
  quantity: string;
  costPerItem: string;
};

const initalStockRow: TStockRow = {
  barcode: "",
  colorId: "",
  sizeId: "",
  quantity: "",
  costPerItem: "",
};

export const StockAddContainer: React.FC = () => {
  const { toast } = useToast();
  const branch = useStore(useBranch, (state) => state.branch);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [stockRow, setStockRow] = useState<TStockRow>(initalStockRow);
  const [stocks, setStocks] = useState<TStockRow[]>([]);

  const [product, setProduct] = useState<ProductList | null>();
  const [colors, setColors] = useState<Colors[] | null>([]);
  const [sizes, setSizes] = useState<Sizes[] | null>([]);
  const [products, setProducts] = React.useState<ProductList[]>([]);

  React.useEffect(() => {
    getProducts({}).then((data) => setProducts(data.products));
  }, []);

  // console.log(colors, sizes, selectedProduct);

  useEffect(() => {
    if (selectedProduct) {
      getSelectedProduct({
        where: { id: Number(selectedProduct) },
      }).then((product) => {
        // @ts-ignore
        setProduct(product);
      });

      getProductColors(Number(selectedProduct)).then((color) => {
        setColors(color);
      });

      getProductSizes(Number(selectedProduct)).then((size) => {
        setSizes(size);
      });
    }
  }, [selectedProduct]);

  const handleBarcodeSumbit = (e: FormEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleStockRowSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStocks([...stocks, stockRow]);
    setStockRow(initalStockRow);
    setShowDialog(false);
  };

  const handleAddStockSubmit = async () => {
    if (!product) return;
    setLoading(true);

    try {
      for (let i = 0; i < stocks.length; i++) {
        await addStockFormAction(Number(product.id), stocks[i], branch);
      }
      setStocks([]);
      toast({
        title: "Success",
        description: "Stocks added successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-6 p-4 rounded-lg">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-2">
          <span className="text-sm font-bold">Search Product</span>
          <ProductSelector
            products={products}
            selectedProduct={selectedProduct}
            setSelectProduct={setSelectedProduct}
          />
        </div>
        {product && (
          <>
            <form
              className="py-6 col-start-1 col-span-4 flex justify-between items-center gap-2 border-y-2 my-2"
              onSubmit={handleBarcodeSumbit}
            >
              <Input
                className="w-1/2"
                type="text"
                id="barcode"
                placeholder="Scan/Type Barcode"
                value={stockRow.barcode}
                onChange={(e) =>
                  setStockRow({ ...stockRow, barcode: e.target.value })
                }
              />
              <Button type="submit">Add Stock</Button>
            </form>
            <div className="col-span-3">
              <div className="flex flex-col w-full gap-2">
                <Table className="rounded-lg overflow-hidden">
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="text-white h-8">Code</TableHead>
                      <TableHead className="text-white h-8">Name</TableHead>
                      <TableHead className="text-white h-8">SKU</TableHead>
                      <TableHead className="text-white h-8">Category</TableHead>
                      <TableHead className="text-white h-8">
                        Selling Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="px-4 py-2">
                        {makeProductCode(product.id)}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {product.name}
                      </TableCell>
                      <TableCell className="px-4 py-2">{product.sku}</TableCell>
                      <TableCell className="px-4 py-2">
                        {product.categoryName}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {product.selling_price}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Table className="rounded-lg overflow-hidden mt-2">
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="text-white h-8">Barcode</TableHead>
                      <TableHead className="text-white h-8">Color</TableHead>
                      <TableHead className="text-white h-8">Size</TableHead>
                      <TableHead className="text-white h-8">Qty</TableHead>
                      <TableHead className="text-white h-8">
                        Cost Per Item
                      </TableHead>
                      <TableHead className="text-white h-8">
                        Total Cost
                      </TableHead>
                      <TableHead className="text-white h-8 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.map((stock, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-2">
                          {stock.barcode}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {
                            colors?.find((c) => String(c.id) === stock.colorId)
                              ?.name
                          }
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {
                            sizes?.find((s) => String(s.id) === stock.sizeId)
                              ?.name
                          }
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {stock.quantity}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {stock.costPerItem}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {parseFloat(stock.costPerItem) *
                            parseInt(stock.quantity)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right">
                          <Button
                            onClick={() => {
                              setStocks(stocks.filter((_, i) => i !== index));
                            }}
                            size="icon"
                            variant="ghost"
                          >
                            <X />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right px-4 py-2">
                        <span className="font-bold">Total</span>
                      </TableCell>
                      <TableCell className="px-4 py-2 font-bold">
                        {stocks.reduce(
                          (acc, stock) => acc + parseInt(stock.quantity),
                          0
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2 font-bold">
                        {stocks.reduce(
                          (acc, stock) => acc + parseFloat(stock.costPerItem),
                          0
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2 font-bold">
                        {stocks.reduce(
                          (acc, stock) =>
                            acc +
                            parseFloat(stock.costPerItem) *
                              parseInt(stock.quantity),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-right px-4 py-2">
                        <Button
                          onClick={handleAddStockSubmit}
                          size="sm"
                          disabled={stocks.length === 0}
                          loading={loading}
                        >
                          Add Stocks
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
            {product.imageUrl ? (
              <Image
                src={fileUrlGenerator(product.imageUrl)}
                className="rounded-xl"
                alt={product.name}
                height={512}
                width={512}
              />
            ) : (
              <p>No Image</p>
            )}
          </>
        )}
      </div>
      
      <Dialog onOpenChange={setShowDialog} open={showDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-[850px]">
          <DialogHeader>
            <DialogTitle>Enter Stock Values</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleStockRowSubmit}
            className="flex gap-2 items-end justify-between"
          >
            <div className="flex flex-col gap-2 w-48">
              <Label>Barcode</Label>
              <Input disabled value={stockRow.barcode} />
            </div>
            <div className="flex flex-col gap-2 w-36">
              <Label>Color</Label>
              <Select
                onValueChange={(v) => setStockRow({ ...stockRow, colorId: v })}
                value={stockRow.colorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors?.map((color) => (
                    <SelectItem key={color.id} value={String(color.id)}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-36">
              <Label>Size</Label>
              <Select
                onValueChange={(v) => setStockRow({ ...stockRow, sizeId: v })}
                value={stockRow.sizeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes?.map((size) => (
                    <SelectItem key={size.id} value={String(size.id)}>
                      {size.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-16">
              <Label>Quantity</Label>
              <Input
                value={stockRow.quantity}
                type="number"
                required
                onChange={(e) =>
                  setStockRow({
                    ...stockRow,
                    quantity: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2 w-36">
              <Label>Cost Per Item</Label>
              <Input
                value={stockRow.costPerItem}
                type="number"
                required
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onChange={(e) =>
                  setStockRow({
                    ...stockRow,
                    costPerItem: e.target.value,
                  })
                }
              />
            </div>
            <Button type="submit" loading={loading}>
              <SendHorizontal />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
