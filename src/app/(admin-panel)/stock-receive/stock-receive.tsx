"use client";

import React from "react";
import { ChallanSelector } from "./challan-selector";
import { ChallanItems, Challans } from "@/types/shared";
import { getChallanItems, getChallans } from "@/services/challan";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { makePrice, makeProductCode } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { StockReceiveAction } from "./action";
import { Label } from "@/components/ui/label";
import { Divide, Printer, SquareMenu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import { useBranch } from "@/hooks/store/use-branch";
import { useStore } from "zustand";
import StockReceiveSlip from "@/components/print-pages/stock-receive-slip";

export default function StockReceive() {
  const branch = useStore(useBranch, (state) => state.branch);
  const [selectedChallanNo, setSelectedChallanNo] = React.useState<
    string | null
  >(null);
  const [challans, setChallans] = React.useState<Challans[]>([]);
  const [challan, setChallan] = React.useState<Challans>();
  const [challanItemList, setChallanItemList] = React.useState<ChallanItems[]>(
    []
  );
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
    getChallans({ where: { status: "PENDING" } }).then((data) => {
      setChallans(data);
    });
  }, []);

  const challanNoSelected = (code: string | null | void) => {
    if (code) {
      setSelectedChallanNo(code);
    }
  };

  const addStockToChallanList = async () => {
    const challan = challans.find(
      (challan) => challan.challan_no === selectedChallanNo
    );

    setChallan(challan);

    if (challan) {
      const data = await getChallanItems({
        where: { challan_id: BigInt(challan.id) },
      });
      setChallanItemList(data);
    }
  };

  React.useEffect(() => {
    if (selectedChallanNo) {
      addStockToChallanList();
    }
  }, [selectedChallanNo, challans]);

  // console.log(challans, "challans from stock receive.");
  // console.log(challanItemList, "challanItemList from stock receive.");

  const confirmTransfer = async () => {
    try {
      setLoading(true);
      const res = await StockReceiveAction(challanItemList, challan);

      if (res) {
        toast({
          title: "Success",
          description: "Stock receive successful!",
          variant: "default",
        });
      }
    } catch (error: any) {
      // console.error(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setChallanItemList([]);
    }
  };

  return (
    <>
      <Card className="p-4 m-4 rounded-md">
        <h1 className="font-semibold mb-2">Transfer Product</h1>
        <div className="flex mb-2 items-center">
          <div className="w-3/5 grid grid-cols-7 gap-3">
            <div className="col-span-3">
              <h1>Select Challan</h1>
              <ChallanSelector
                challans={challans}
                setSelectedChallan={challanNoSelected}
              />
            </div>
            <div className="col-span-2">
              <Label>From</Label>
              {challan ? (
                <div className="border rounded border-gray-200 p-2">
                  <span>{challan?.from_branch_name}</span>
                </div>
              ) : (
                <div className="border rounded-md border-gray-200 p-2 text-gray-400 text-[15px]">
                  From Branch
                </div>
              )}
            </div>
            <div className="col-span-2">
              <Label>Send To</Label>
              {challan ? (
                <div className="border rounded border-gray-200 p-2">
                  <span>{challan?.to_branch_name}</span>
                </div>
              ) : (
                <div className="border rounded-md border-gray-200 p-2 text-gray-400 text-[15px]">
                  To Branch
                </div>
              )}
            </div>
          </div>
          <div className="w-2/5 pl-6">
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
                  {challanItemList.reduce(
                    (acc, item) => acc + Number(item.quantity),
                    0
                  )}
                </span>
              </div>
              <div className="p-2">
                <h1 className="text-[#828282]">Transfer Product Value</h1>
                <span className="font-semibold">
                  {
                    challanItemList.reduce(
                      (acc, item) =>
                        acc +
                        Number(item.quantity) * Number(item.selling_price),
                      0
                    )
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 m-4 rounded-md flex justify-end items-center">
        <Button
          className=""
          disabled={challanItemList.length === 0}
          onClick={confirmTransfer}
          loading={loading}
        >
          Confirm Receive
        </Button>
      </Card>

      <Card className="p-4 m-4 rounded-md min-h-72">
        {challanItemList.length > 0 && (
          <div>
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
                {challanItemList.map((item, index) => (
                  <TableRow key={item.barcode}>
                    <TableCell className="py-2">{index + 1}</TableCell>
                    <TableCell className="py-2">{item.barcode}</TableCell>
                    <TableCell className="py-2">
                      {makeProductCode(Number(item.product_id))}
                    </TableCell>
                    <TableCell className="py-2">{item.name}</TableCell>
                    <TableCell className="py-2">{item.categoryName}</TableCell>
                    <TableCell className="py-2">{item.variant}</TableCell>
                    <TableCell className="py-2">{item.quantity}</TableCell>
                    <TableCell className="py-2">
                      {item.selling_price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <div className="hidden">
        <StockReceiveSlip
          existingBranch={branch}
          ref={printerRef}
          challanItemList={challanItemList}
        />
      </div>
    </>
  );
}
