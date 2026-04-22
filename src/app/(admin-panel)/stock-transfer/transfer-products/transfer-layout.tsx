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
import { useStore } from "@/hooks/store/use-store";
import { useBranch } from "@/hooks/store/use-branch";
import { Card } from "@/components/ui/card";
import { PackageSearch, SquareMenu, Trash2 } from "lucide-react";

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
  quantity?: number;
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
  const { setChallanNo } = usePOSStore();
  const currentBranch = useStore(useBranch, (state) => state.branch);

  const [fromBranchId, setFromBranchId] = React.useState<number | null>(null);
  const [toBranchId, setToBranchId] = React.useState<number | null>(null);
  const [stocks, setStocks] = React.useState<StockPayload[]>([]);
  const [selectedBarcode, setSelectedBarcode] = React.useState<string | null>(
    null
  );
  const [qtyLimit, setQtyLimit] = React.useState<number>(0);
  const [selectedQty, setSelectedQty] = React.useState<number>(1);
  const [qtyModalOpen, setQtyModalOpen] = React.useState<boolean>(false);
  const [transferList, setTransferList] = React.useState<PartialChallanItem[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!currentBranch?.id) return;

    setFromBranchId((prev) =>
      prev === currentBranch.id ? prev : Number(currentBranch.id)
    );
  }, [currentBranch?.id]);

  React.useEffect(() => {
    if (!fromBranchId) {
      setStocks([]);
      return;
    }

    getStocks({
      where: { branch_id: fromBranchId },
      distinct: ["barcode"],
    }).then((data) => {
      setStocks(data as StockPayload[]);
    });
  }, [fromBranchId]);

  React.useEffect(() => {
    setSelectedBarcode(null);
    setSelectedQty(1);
    setQtyLimit(0);
    setQtyModalOpen(false);
    setTransferList([]);

    if (fromBranchId === toBranchId) {
      setToBranchId(null);
    }
  }, [fromBranchId]);

  const addStockToTransferList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const stock = stocks.find((item) => item.barcode === selectedBarcode);
    if (!stock) {
      toast({
        title: "Stock not found",
        description: "Please select a valid stock item.",
        variant: "destructive",
      });
      return;
    }

    if (selectedQty < 1 || selectedQty > qtyLimit) {
      toast({
        title: "Invalid quantity",
        description: `Please enter a quantity between 1 and ${qtyLimit}.`,
        variant: "destructive",
      });
      return;
    }

    const variant = `${stock.colorName || "-"} - ${stock.sizeName || "-"}`;

    setTransferList((current) => {
      const existing = current.find((item) => item.barcode === stock.barcode);
      const maxTransferQty =
        Number(existing?.quantity || 0) + Number(qtyLimit || selectedQty);
      const stockWithLimit = { ...stock, quantity: maxTransferQty };
      if (existing) {
        return current.map((item) =>
          item.barcode === stock.barcode
            ? {
                ...item,
                quantity: Number(item.quantity) + selectedQty,
                stock: stockWithLimit,
                variant,
              }
            : item
        );
      }

      return [
        ...current,
        {
          barcode: stock.barcode,
          quantity: selectedQty,
          product_id: stock.productId,
          variant,
          stock: stockWithLimit,
        },
      ];
    });

    setSelectedBarcode(null);
    setSelectedQty(1);
    setQtyLimit(0);
    setQtyModalOpen(false);
  };

  const barcodeSelected = async (code: string | null | void) => {
    if (!code || !fromBranchId) {
      setSelectedBarcode(null);
      return;
    }

    setSelectedBarcode(code);

    const data = await getStocksCount({
      where: { barcode: code, branch_id: fromBranchId },
    });
    const itemInList = transferList.find((item) => item.barcode === code);
    const availableQty = itemInList ? data - Number(itemInList.quantity) : data;

    if (availableQty <= 0) {
      setSelectedBarcode(null);
      setQtyLimit(0);
      setQtyModalOpen(false);
      toast({
        title: "No stock available",
        description: "This item is already fully added to the transfer list.",
        variant: "destructive",
      });
      return;
    }

    setQtyLimit(availableQty);
    setSelectedQty(1);
    setQtyModalOpen(true);
  };

  const removeTransferItem = (barcode: string) => {
    setTransferList((current) =>
      current.filter((item) => item.barcode !== barcode)
    );
  };

  const updateTransferQuantity = (barcode: string, quantity: number) => {
    const selectedItem = transferList.find((item) => item.barcode === barcode);
    const maxQty = Number(
      selectedItem?.stock?.quantity || selectedItem?.quantity || 1
    );
    const nextQty = Math.min(Math.max(quantity || 1, 1), maxQty);

    setTransferList((current) =>
      current.map((item) =>
        item.barcode === barcode ? { ...item, quantity: nextQty } : item
      )
    );
  };

  const confirmTransfer = async () => {
    if (!fromBranchId || !toBranchId) {
      toast({
        title: "Branch required",
        description: "Please select both source and destination branches.",
        variant: "destructive",
      });
      return;
    }

    if (fromBranchId === toBranchId) {
      toast({
        title: "Invalid branch selection",
        description: "From Branch and To Branch cannot be the same.",
        variant: "destructive",
      });
      return;
    }

    if (transferList.length === 0) {
      toast({
        title: "No products selected",
        description: "Add at least one stock item before confirming transfer.",
        variant: "destructive",
      });
      return;
    }

    setChallanNo();
    const { challanNo } = usePOSStore.getState();
    const totalQty = transferList.reduce(
      (acc, item) => acc + Number(item.quantity),
      0
    );
    const toBranchName = branches.find((branch) => branch.id === toBranchId)?.name;

    if (
      !(await confirmation(
        `Are you sure to transfer ${totalQty} items to ${toBranchName} branch?`
      ))
    ) {
      return;
    }

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

      toast({
        title: "Success",
        description: "Stock transfer request created!",
        variant: "default",
      });
      setTransferList([]);
      setSelectedBarcode(null);
      setSelectedQty(1);
      setQtyLimit(0);
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

  const destinationBranches = React.useMemo(
    () => branches.filter((branch) => branch.id !== fromBranchId),
    [branches, fromBranchId]
  );

  const totalQuantity = transferList.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );
  const totalValue = transferList.reduce(
    (acc, item) =>
      acc + Number(item.quantity) * Number(item.stock?.selling_price),
    0
  );

  return (
    <>
      <Card className="m-4 rounded-md p-4">
        <h1 className="mb-4 font-semibold">Transfer Product</h1>
        <div className="grid gap-4 lg:grid-cols-11">
          <div className="lg:col-span-3">
            <Label>
              From Branch <b className="text-red-500">*</b>
            </Label>
            <Select
              onValueChange={(value) => setFromBranchId(parseInt(value, 10))}
              value={fromBranchId ? String(fromBranchId) : ""}
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
            {currentBranch?.id ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Current selected branch: {currentBranch.name}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <Label>
              To Branch <b className="text-red-500">*</b>
            </Label>
            <Select
              onValueChange={(value) => setToBranchId(parseInt(value, 10))}
              value={toBranchId ? String(toBranchId) : ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {destinationBranches.map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#E1FFCF] p-2">
                <SquareMenu color="#358A00" />
              </span>
              <h1>Transfer Overview</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 sm:divide-x-2">
              <div className="p-2">
                <h1 className="text-[#828282]">Total Quantity</h1>
                <span className="font-semibold">{totalQuantity}</span>
              </div>
              <div className="p-2">
                <h1 className="text-[#828282]">Transfer Product Value</h1>
                <span className="font-semibold">{makePrice(totalValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="m-4 flex flex-col gap-4 rounded-md p-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full lg:w-1/2">
          <Label>Select Stock</Label>
          <StockSelector
            stocks={stocks}
            setSelectedStock={barcodeSelected}
            qtyLimit={qtyLimit}
            value={selectedBarcode}
            disabled={!fromBranchId || stocks.length === 0}
            emptyMessage={
              fromBranchId
                ? "No stock found for this branch."
                : "Select a source branch first."
            }
          />
          {!fromBranchId && (
            <p className="mt-2 text-sm text-muted-foreground">
              Choose the source branch first to load available stock.
            </p>
          )}
        </div>

        <Button
          className="w-full lg:w-auto"
          disabled={
            loading ||
            transferList.length === 0 ||
            !toBranchId ||
            !fromBranchId ||
            fromBranchId === toBranchId
          }
          onClick={confirmTransfer}
          loading={loading}
        >
          Confirm Transfer
        </Button>
      </Card>

      <Card className="m-4 min-h-80 rounded-md p-4">
        {transferList.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="overflow-hidden rounded-lg">
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
                  <TableHead className="h-8 text-right text-white">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transferList.map((item, index) => (
                  <TableRow key={String(item.barcode)}>
                    <TableCell className="py-2">{index + 1}</TableCell>
                    <TableCell className="py-2">{item.barcode}</TableCell>
                    <TableCell className="py-2">
                      {makeProductCode(Number(item.product_id))}
                    </TableCell>
                    <TableCell className="py-2">{item.stock?.name}</TableCell>
                    <TableCell className="py-2">{item.stock?.categoryName}</TableCell>
                    <TableCell className="py-2">{item.variant}</TableCell>
                    <TableCell className="py-2">
                      <Input
                        className="w-20"
                        type="number"
                        min={1}
                        max={Number(item.stock?.quantity || item.quantity)}
                        value={Number(item.quantity)}
                        onChange={(e) =>
                          updateTransferQuantity(
                            String(item.barcode),
                            parseInt(e.target.value, 10) || 1
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      {makePrice(
                        Number(item.stock?.selling_price) * Number(item.quantity)
                      )}
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeTransferItem(String(item.barcode))}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow className="font-bold">
                  <TableCell colSpan={6} className="text-right">
                    Total
                  </TableCell>
                  <TableCell>{totalQuantity}</TableCell>
                  <TableCell>{makePrice(totalValue)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <PackageSearch className="mb-3 h-10 w-10 text-muted-foreground" />
            <h2 className="font-medium">No stock selected yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a source branch, search a stock item, and add it to the transfer list.
            </p>
          </div>
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
              onChange={(e) => setSelectedQty(parseInt(e.target.value, 10) || 1)}
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
