"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, Package, TrendingDown, Hash } from "lucide-react";
import React from "react";
import { makeBDPrice } from "@/utils/helpers";

interface DamageItem {
  quantity?: number | string;
  cost?: number | string;
  selling_price?: number | string;
}

interface Props {
  data: DamageItem[];
}

export const DamageListDashboard: React.FC<Props> = ({ data }) => {
  const totals = React.useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.totalQty += Number(item.quantity || 0);
        acc.stockValue += Number(item.quantity || 0) * Number(item.cost || 0);
        acc.sellValue +=
          Number(item.quantity || 0) * Number(item.selling_price || 0);
        return acc;
      },
      { totalQty: 0, stockValue: 0, sellValue: 0 }
    );
  }, [data]);

  const stats = [
    {
      label: "Total Records",
      value: data.length,
      icon: Hash,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Total Qty Damaged",
      value: totals.totalQty,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950",
    },
    {
      label: "Total Stock Value",
      value: makeBDPrice(Math.round(totals.stockValue)),
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
    {
      label: "Total Sell Value",
      value: makeBDPrice(Math.round(totals.sellValue)),
      icon: TrendingDown,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <Card className="m-4 mb-2 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="text-red-500" size={18} />
        <p className="text-base font-semibold">Damage Products Overview</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-3 rounded-lg p-3 ${stat.bg}`}
            >
              <Icon className={stat.color} size={22} />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
