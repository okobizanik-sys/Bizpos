"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Printer, Search, Loader2 } from "lucide-react";
import { BarcodeLabel } from "@/components/BarcodeLabel";
import {
  getStocksForPrint,
  type StockForPrint,
} from "@/app/(admin-panel)/inventories/products/barcode-print-action";

interface RowState {
  selected: boolean;
  qty: number;
}

const COMPANY =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_COMPANY_NAME ||
      process.env.NEXT_PUBLIC_BRAND_NAME)) ||
  "YOUR COMPANY";

export function BarcodePrintDialog() {
  const [stocks, setStocks] = useState<StockForPrint[]>([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Record<number, RowState>>({});
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = async (v: boolean) => {
    setOpen(v);
    if (v) {
      setSearch("");
      setLoading(true);
      try {
        const data = await getStocksForPrint();
        setStocks(data);
        const map: Record<number, RowState> = {};
        data.forEach((s) => {
          map[s.stockId] = { selected: false, qty: 1 };
        });
        setRows(map);
      } finally {
        setLoading(false);
      }
    }
  };

  const filtered = useMemo(
    () =>
      stocks.filter(
        (s) =>
          (s.productName ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (s.sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (s.barcode ?? "").includes(search) ||
          (s.colorName ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (s.sizeName ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
    [stocks, search],
  );

  const selectedIds = Object.entries(rows)
    .filter(([, v]) => v.selected)
    .map(([k]) => Number(k));

  const totalLabels = selectedIds.reduce(
    (sum, id) => sum + (rows[id]?.qty || 1),
    0,
  );

  const allSelected =
    filtered.length > 0 && filtered.every((s) => rows[s.stockId]?.selected);

  const toggleAll = () => {
    const next = !allSelected;
    setRows((prev) => {
      const updated = { ...prev };
      filtered.forEach((s) => {
        updated[s.stockId] = { ...updated[s.stockId], selected: next };
      });
      return updated;
    });
  };

  const toggleRow = (id: number) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected },
    }));
  };

  const setQty = (id: number, value: number) => {
    const safe = Math.max(1, Math.min(500, isNaN(value) ? 1 : value));
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: safe },
    }));
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { size: 50mm 30mm; margin: 0; }
      body { margin: 0; }
      .label-wrapper {
        width: 50mm; height: 30mm; padding: 2mm;
        page-break-after: always; overflow: hidden; box-sizing: border-box;
      }
      .label {
        display: flex; flex-direction: column;
        align-items: center; gap: 1px;
      }
      .company { font-size: 8pt; font-weight: bold; text-transform: uppercase; margin: 0; }
      .product-name { font-size: 7pt; text-align: center; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
      .price-row { display: flex; gap: 6px; font-size: 7pt; margin: 0; }
      .mrp { text-decoration: line-through; color: #555; }
      .sale { font-weight: bold; }
    `,
  });

  const labelsToPrint = useMemo(() => {
    const list: { stock: StockForPrint; qty: number }[] = [];
    selectedIds.forEach((id) => {
      const stock = stocks.find((s) => s.stockId === id);
      if (stock) list.push({ stock, qty: rows[id].qty });
    });
    return list;
  }, [selectedIds, rows, stocks]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-purple-500 text-purple-500 hover:bg-purple-50 hover:text-purple-600 gap-2"
        >
          <Printer size={15} />
          Print Barcodes
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-full p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-base font-semibold">
              Print Barcode Labels
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {selectedIds.length > 0 && (
                <>
                  <Badge variant="secondary">
                    {selectedIds.length} variant
                    {selectedIds.length !== 1 ? "s" : ""}
                  </Badge>
                  <Badge variant="outline">
                    {totalLabels} label{totalLabels !== 1 ? "s" : ""}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 h-9"
              placeholder="Search by name, SKU, barcode, color or size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAll}
            disabled={loading || filtered.length === 0}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>

        {/* Stock rows */}
        <ScrollArea className="h-[340px]">
          <div className="divide-y px-1">
            {loading && (
              <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading stocks...</span>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No stock entries match.
              </p>
            )}
            {!loading &&
              filtered.map((stock) => {
                const checked = rows[stock.stockId]?.selected ?? false;
                const qty = rows[stock.stockId]?.qty ?? 1;
                const variantLabel = [stock.colorName, stock.sizeName]
                  .filter((v) => v && v !== "-" && v !== "null")
                  .join(" - ");

                return (
                  <div
                    key={stock.stockId}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleRow(stock.stockId)}
                      id={`row-${stock.stockId}`}
                    />
                    <label
                      htmlFor={`row-${stock.stockId}`}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <p className="text-sm font-medium truncate leading-tight">
                        {stock.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stock.sku}
                        {variantLabel ? ` · ${variantLabel}` : ""}
                        {" · "}
                        <span className="font-mono">{stock.barcode}</span>
                      </p>
                    </label>

                    <span className="text-sm font-medium shrink-0">
                      ৳{stock.selling_price}
                    </span>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="w-6 h-6 rounded border text-sm leading-none hover:bg-muted disabled:opacity-40"
                        disabled={!checked}
                        onClick={() => setQty(stock.stockId, qty - 1)}
                      >
                        -
                      </button>
                      <Input
                        type="number"
                        min={1}
                        max={500}
                        value={qty}
                        disabled={!checked}
                        onChange={(e) =>
                          setQty(stock.stockId, parseInt(e.target.value))
                        }
                        className="w-14 h-7 text-center text-sm px-1"
                      />
                      <button
                        type="button"
                        className="w-6 h-6 rounded border text-sm leading-none hover:bg-muted disabled:opacity-40"
                        disabled={!checked}
                        onClick={() => setQty(stock.stockId, qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-muted/20 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Each row is a stock variant. Barcode shown is the same one used in
            POS.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-2"
              disabled={selectedIds.length === 0}
              onClick={handlePrint}
            >
              <Printer size={14} />
              Print
              {totalLabels > 0
                ? ` ${totalLabels} label${totalLabels !== 1 ? "s" : ""}`
                : ""}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Hidden print target */}
      <div className="hidden">
        <div ref={printRef}>
          {labelsToPrint.map(({ stock, qty }) =>
            Array.from({ length: qty }).map((_, i) => (
              <BarcodeLabel
                key={`${stock.stockId}-${i}`}
                companyName={COMPANY}
                productName={stock.productName}
                sellingPrice={stock.selling_price}
                barcodeString={stock.barcode}
              />
            )),
          )}
        </div>
      </div>
    </Dialog>
  );
}
