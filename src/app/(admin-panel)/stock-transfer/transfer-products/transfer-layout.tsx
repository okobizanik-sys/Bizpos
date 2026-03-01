"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getStocks, getStocksCount } from "@/services/stock";
import { StockSelector } from "./stock-selector";
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
import { makePrice, makeProductCode } from "@/utils/helpers";
import { confirmation } from "@/components/modals/confirm-modal";
import { transferProductsAction } from "./action";
import { useToast } from "@/components/ui/use-toast";
import { Branches, ChallanItems, Challans } from "@/types/shared";
import { createChallanItem } from "@/services/challan";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { Card } from "@/components/ui/card";
import { SquareMenu } from "lucide-react";
import { POSItem } from "../../pos/item-selector";

export type StockPayload = {
  name: string;
  sku: string;
  description: string;
  color_id?: number;
  size_id?: number;
  colorName: string;
  sizeName: string;
  branchName: string;
  categoryName: string;
  branchId: number;
  id: bigint;
  barcode: string;
  cost: number;
  productId: bigint;
  selling_price: number;
  condition?: string;
  url?: string;
};

export type PartialChallanItem = Partial<
  ChallanItems & { stock: StockPayload } & Challans
>;

interface Props {
  branches: Branches[];
}

export const TransferLayout: React.FC<Props> = ({ branches }) => {
  const { toast } = useToast();
  const { challanNo, setChallanNo } = usePOSStore();

  const [fromBranchId, setFromBranchId] = React.useState<number>();
  const [toBranchId, setToBranchId] = React.useState<number>();
  const [stocks, setStocks] = React.useState<StockPayload[]>([]);
  const [selectedBarcode, setSelectedBarcode] = React.useState<string | null>(
    null
  );
  const [qtyLimit, setQtyLimit] = React.useState<number>(0);
  const [selectedQty, setSelectedQty] = React.useState<number>(0);
  const [qtyModalOpen, setQtyModalOpen] = React.useState<boolean>(false);
  const [transferList, setTransferList] = React.useState<PartialChallanItem[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (fromBranchId) {
      getStocks({
        where: { branch_id: fromBranchId },
        distinct: ["barcode"],
      }).then((data) => {
        // @ts-ignore
        setStocks(data);
      });
    }
  }, [fromBranchId]);
  // console.log("from transfer layout, stocks:", stocks);

  const addStockToTransferList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const stock = stocks.find((stock) => stock.barcode === selectedBarcode);
    if (stock) {
      setTransferList([
        ...transferList,
        {
          barcode: stock.barcode,
          quantity: selectedQty,
          product_id: stock.productId,
          variant: (stock.colorName || "") + " - " + (stock.sizeName || ""),
          stock: stock,
        },
      ]);
      // const filtered = stocks.filter((s) => s.barcode !== selectedBarcode);
      // setStocks(filtered);
      setSelectedQty(0);
      setQtyModalOpen(false);
    }
  };

  const barcodeSelected = (code: string | null | void) => {
    if (code) {
      setSelectedBarcode(code);
      getStocksCount({
        where: { barcode: code, branch_id: fromBranchId },
      }).then((data) => {
        const itemInList = transferList.find((item) => item.barcode === code);
        setQtyLimit(itemInList ? data - Number(itemInList.quantity) : data);
      });
      setQtyModalOpen(true);
    }
  };

  const confirmTransfer = async () => {
    setChallanNo();
    const { challanNo } = usePOSStore.getState();
    // console.log(challanNo, "challan no. from transfer layout")

    const totalQty = transferList.reduce(
      (acc, item) => acc + Number(item.quantity),
      0
    );

    const toBranchName = branches.find((b) => b.id === toBranchId)?.name;

    if (
      await confirmation(
        `Are you sure to transfer ${totalQty} items to ${toBranchName} branch?`
      )
    ) {
      setLoading(true);
      try {
        const challan = await transferProductsAction({
          from_branch_id: fromBranchId,
          to_branch_id: toBranchId,
          quantity: totalQty,
          challan_no: challanNo,
        });

        await createChallanItem(
          transferList.map((item) => ({
            challan_id: BigInt(challan.id),
            quantity: Number(item.quantity),
            product_id: BigInt(item.product_id || 0),
            variant: item.variant as string,
            barcode: item.barcode as string,
          }))
        );

        if (challan) {
          toast({
            title: "Success",
            description: "Stock transfer request created!",
            variant: "default",
          });
          setTransferList([]);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Card className="p-4 m-4 rounded-md">
        <h1 className="font-semibold mb-4">Transfer Product</h1>
        <div className="grid grid-cols-11 gap-2">
          <div className="col-span-3">
            <Label>
              From Branch <b className="text-red-500">*</b>
            </Label>
            <Select
              onValueChange={(v) => setFromBranchId(parseInt(v))}
              value={fromBranchId?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3">
            <Label>To Branch</Label>
            <Select
              onValueChange={(v) => setToBranchId(parseInt(v))}
              value={toBranchId?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-5 pl-6">
            <div className="flex gap-2 items-center">
              <span className="bg-[#E1FFCF] p-2 rounded-md">
                <SquareMenu color="#358A00" />
              </span>
              <h1>Transfer Overview</h1>
            </div>
            <div className="flex justify-between divide-x-2 gap-2">
              <div className="p-2">
                <h1 className="text-[#828282]">Total Quantity</h1>
                <span className="font-semibold">
                  {transferList.reduce(
                    (acc, item) => acc + Number(item.quantity),
                    0
                  )}
                </span>
              </div>
              <div className="p-2">
                <h1 className="text-[#828282]">Transfer Product Value</h1>
                <span className="font-semibold">
                  {transferList.reduce(
                    (acc, item) =>
                      acc +
                      Number(item.quantity) * Number(item.stock?.selling_price),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 m-4 rounded-md flex items-center justify-between">
        <div className="w-1/2">
          <Label>Select Stock</Label>
          <StockSelector
            stocks={stocks}
            setSelectedStock={barcodeSelected}
            qtyLimit={qtyLimit}
          />
        </div>

        <Button
          className=""
          disabled={transferList.length === 0 || !toBranchId || !fromBranchId}
          onClick={confirmTransfer}
          loading={loading}
        >
          Confirm Transfer
        </Button>
      </Card>

      <Card className="p-4 m-4 rounded-md min-h-80">
        {transferList.length > 0 && (
          <Table className="rounded-lg overflow-hidden">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="h-8 text-white">#</TableHead>
                <TableHead className="h-8 text-white">Barcode</TableHead>
                <TableHead className="h-8 text-white">Product ID</TableHead>
                <TableHead className="h-8 text-white">Product Name</TableHead>
                <TableHead className="h-8 text-white">Category</TableHead>
                <TableHead className="h-8 text-white">Variant</TableHead>
                <TableHead className="h-8 text-white">Qty</TableHead>
                <TableHead className="h-8 text-white">Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transferList.map((item, index) => (
                <TableRow key={item.barcode}>
                  <TableCell className="py-2">{index + 1}</TableCell>
                  <TableCell className="py-2">{item.barcode}</TableCell>
                  <TableCell className="py-2">
                    {makeProductCode(Number(item.product_id))}
                  </TableCell>
                  <TableCell className="py-2">{item.stock?.name}</TableCell>
                  <TableCell className="py-2">
                    {item.stock?.categoryName}
                  </TableCell>
                  <TableCell className="py-2">{item.variant}</TableCell>
                  <TableCell className="py-2">{item.quantity}</TableCell>
                  <TableCell className="py-2">
                    {Number(item.stock?.selling_price) * Number(item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="font-bold">
                <TableCell colSpan={6} className="text-right">
                  Total
                </TableCell>
                <TableCell>
                  {transferList.reduce(
                    (acc, item) => acc + Number(item.quantity),
                    0
                  )}
                </TableCell>
                <TableCell>
                  {transferList.reduce(
                    (acc, item) =>
                      acc +
                      Number(item.stock?.selling_price) * Number(item.quantity),
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </Card>

      <Dialog open={qtyModalOpen} onOpenChange={setQtyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Quantity (In Stock: {qtyLimit})</DialogTitle>
          </DialogHeader>
          <form onSubmit={addStockToTransferList} className="flex gap-2">
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
              Add to Transfer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
