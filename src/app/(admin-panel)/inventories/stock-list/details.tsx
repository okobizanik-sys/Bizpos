"use client";

import React from "react";
import { ProductWithStockPayload } from "./page";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { fileUrlGenerator } from "@/utils/helpers";
import Barcode from "react-barcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateStockAction } from "./action";
import { useToast } from "@/components/ui/use-toast";

interface Prop {
  product: ProductWithStockPayload;
}

export const StockDetails: React.FC<Prop> = ({ product }) => {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedQty, setSelectedQty] = React.useState(0);
  const [selectedBarcode, setSelectedBarcode] = React.useState("");
  const { toast } = useToast();

  // console.log(product);

  const handleEditStock = (product: ProductWithStockPayload) => {
    setModalOpen(true);
    setSelectedBarcode(product.barcode);
    console.log(product);
  };

  const updateStock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateStockAction(selectedBarcode, selectedQty);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSelectedQty(0);
      setSelectedBarcode("");
      window.location.reload();
    }
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-full overflow-y-auto bg-slate-100 sm:max-w-[750px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Stock Details</SheetTitle>
          </SheetHeader>

          <Card className="mb-6 p-4 rounded-lg bg-white">
            <div>
              <span className="font-semibold">Branch: </span>
              <span>{product.branchName}</span>
            </div>
          </Card>

          <Card className="mb-6 p-4 rounded-lg bg-white flex flex-col lg:flex-row gap-2 w-full">
            <div className="lg:w-1/2">
              {product.url && (
                <Image
                  src={fileUrlGenerator(product.url)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full aspect-square rounded-lg"
                />
              )}
            </div>
            <div className="lg:w-1/2">
              <ul className="my-4">
                <li>
                  <span className="text-gray-600">Barcode: </span>
                  <Barcode
                    value={product.barcode}
                    width={2}
                    height={45}
                    fontSize={16}
                    fontOptions="bold"
                  />
                  {/* <span className="font-semibold">{product.barcode}</span> */}
                </li>
                <li>
                  <span className="text-gray-600">Product Name: </span>
                  <span className="font-semibold">{product.name}</span>
                </li>
                <li>
                  <span className="text-gray-600">Category: </span>
                  <span className="font-semibold">{product.categoryName}</span>
                </li>
                <li>
                  <span className="text-gray-600">Variant: </span>
                  <span className="font-semibold">
                    {product.colorName} ~ {product.sizeName}
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">SKU: </span>
                  <span className="font-semibold">{product.sku}</span>
                </li>
                <li>
                  <span className="text-gray-600">Stock Value: </span>
                  <span className="font-semibold">{product.cost}</span>
                </li>
                <li>
                  <span className="text-gray-600">Sell Value: </span>
                  <span className="font-semibold">{product.selling_price}</span>
                </li>
                <li className="flex justify-start items-center gap-3">
                  <div>
                    <span className="text-gray-600">Qty: </span>
                    <span className="font-semibold">{product.quantity}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleEditStock(product)}
                  >
                    <Edit size={14} />
                  </Button>
                </li>
              </ul>
            </div>
          </Card>
        </SheetContent>
      </Sheet>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Quantity</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateStock} className="flex gap-2">
            <Input
              className="w-full sm:w-[200px]"
              type="number"
              min={1}
              value={selectedQty}
              required
              onChange={(e) => setSelectedQty(parseInt(e.target.value))}
            />
            <Button className="flex-1" type="submit" loading={loading}>
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
