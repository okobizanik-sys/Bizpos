"use client";

import React from "react";
import { Navbar } from "@/components/admin-panel/navbar";
import DamageProductsTable from "./branch-damage-products-table";
import { FilterDamageProductsForm } from "./filter";
import { StockPayload } from "../stock-transfer/transfer-products/transfer-layout";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "zustand";
import { useBranch } from "@/hooks/store/use-branch";
import { playBeep } from "../pos/barcode-scanner.hook";
import { usePOSStore } from "@/hooks/store/use-pos-store";
import { useSearchParams } from "next/navigation";

export default function DamageProductsPage() {
  const { itemList, addItem } = usePOSStore();
  const [stocks, setStocks] = React.useState<StockPayload[]>([]);
  const [selectedBarcode, setSelectedBarcode] = React.useState<string | null>(
    null,
  );
  const branch = useStore(useBranch, (state) => state.branch);
  const [qtyLimit, setQtyLimit] = React.useState<number>(0);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  async function fetchStockCount(branchId: number, barcode: string) {
    const res = await fetch(
      `/api/pos/stock-count?branch_id=${branchId}&barcode=${encodeURIComponent(
        barcode,
      )}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch stock count");
    }

    const data = await res.json();
    return data.totalQuantity as number;
  }

  const barcodeSelected = async (code: string | null | void) => {
    if (code) {
      if (!branch?.id) {
        toast({
          title: "Branch not selected",
          description: "Please select a branch before adding items.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setSelectedBarcode(code);
      fetchStockCount(Number(branch.id), code)
        .then((data) => {
          const itemInList = itemList.find((item) => item.barcode === code);
          setQtyLimit(itemInList ? data - itemInList.quantity : data);
        })
        .catch((error) => {
          console.error("Failed to fetch stock count:", error);
        });

      const stock = stocks.find((stock) => stock.barcode === code);
      if (stock) {
        addItem({
          barcode: stock.barcode,
          productId: stock.productId,
          name: stock.name,
          colorId: stock.color_id,
          colorName: stock.colorName || "-",
          sizeId: stock.size_id,
          sizeName: stock.sizeName || "-",
          quantity: 1,
          selling_price: stock.selling_price,
          cost: stock.cost,
        });
        playBeep(true);
      } else {
        playBeep(false);
        toast({
          title: "Barcode not found",
          description: `"${code}" is not available in this branch's stock.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const filter = {
    search: searchParams.get("search") ?? undefined,
    fromDate: searchParams.get("fromDate")
      ? new Date(searchParams.get("fromDate") as string)
      : undefined,
    toDate: searchParams.get("toDate")
      ? new Date(searchParams.get("toDate") as string)
      : undefined,
  };

  return (
    <>
      <Navbar title="Damage Products" />
      <FilterDamageProductsForm currentFilters={filter} />
      <DamageProductsTable
        search={filter.search}
        fromDate={filter.fromDate}
        toDate={filter.toDate}
      />
    </>
  );
}
