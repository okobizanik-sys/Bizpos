import { Card } from "@/components/ui/card";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { NotepadText } from "lucide-react";
import React from "react";
import { StockSummary } from "./page";

interface Props {
  summary: StockSummary;
}

export const StockDashboard: React.FC<Props> = ({ summary }) => {
  return (
    <Card className="m-6 my-2 p-4 rounded-lg">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-[#E1FFCF]">
            <NotepadText className="text-[#358A00]" />
          </div>
          <p className="text-base font-semibold">Stock Overview</p>
        </div>
        <div className="">
          <p className="text-sm text-[#646464]">Total Quantity</p>
          <p className="lg:text-end text-lg font-semibold">
            {summary.totalQuantity}
          </p>
        </div>
        <div className="">
          <p className="text-sm text-[#646464]">Stock Value</p>
          <p className="lg:text-end text-lg font-semibold">
            ৳{summary.totalStockValue}
          </p>
        </div>
        <div className="">
          <p className="text-sm text-[#646464]">Sell Value</p>
          <p className="lg:text-end text-lg font-semibold">
            ৳{summary.totalSellValue}
          </p>
        </div>
      </div>
    </Card>
  );
};
