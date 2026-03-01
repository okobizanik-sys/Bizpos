"use client";

import { Card } from "@/components/ui/card";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { SalesData } from "@/types/shared";
import { Package } from "lucide-react";
import React from "react";

interface Props {
  salesData: SalesData[];
}

export const SalesDashboard: React.FC<Props> = ({salesData}) => {
  const { totalOrders, totalSales, totalCOGS, totalVAT, calculateSalesTotals } =
    usePOSStore();

  React.useEffect(() => {
    calculateSalesTotals(salesData);
  }, [salesData, calculateSalesTotals]);

  return (
    <Card className="m-4 mb-2 p-4 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Package className="text-[#65CA00]" />
          <div className="">
            <p className="text-sm text-[#646464]">Complete Orders</p>
            <p className="text-end text-lg font-semibold">{totalOrders}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Package className="text-[#65CA00]" />
          <p className="text-base font-semibold">Sales Overview</p>
        </div>
        <div className="">
          <p className="text-sm text-[#646464]">Total Sales</p>
          <p className="text-end text-lg font-semibold">৳{totalSales}</p>
        </div>
        <div className="">
          <p className="text-sm text-[#646464]">Total COGS</p>
          <p className="text-end text-lg font-semibold">৳{totalCOGS}</p>
        </div>
        {/* <div className="">
          <p className="text-sm text-[#646464]">Total VAT</p>
          <p className="text-end text-lg font-semibold">৳{totalVAT}</p>
        </div> */}
      </div>
    </Card>
  );
};
