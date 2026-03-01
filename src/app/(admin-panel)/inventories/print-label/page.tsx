"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React, { useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { StockPayload } from "../../stock-transfer/transfer-products/transfer-layout";
import { useStore } from "@/hooks/store/use-store";
import { useBranch } from "@/hooks/store/use-branch";
import { getStocksByProduct } from "@/services/stock";
import { StockSelector } from "../../stock-transfer/transfer-products/stock-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function PrintLabelPage() {
  const [stocks, setStocks] = useState<StockPayload[]>([]);
  const [stock, setStock] = useState<StockPayload | null>(null);
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [priceCheck, setPriceCheck] = useState<boolean>(false);
  const [variantCheck, setVariantCheck] = useState<boolean>(true);
  const [nameCheck, setNameCheck] = useState<boolean>(true);

  const branch = useStore(useBranch, (state) => state.branch);
  const printerRef = useRef(null);

  React.useEffect(() => {
    if (branch) {
      getStocksByProduct({
        where: { branchId: Number(branch.id) },
      }).then((data) => {
        setStocks(data as StockPayload[]);
      });
    }
  }, [branch]);

  const barcodeSelected = (code: string | null | void) => {
    if (code) {
      setSelectedBarcode(code);
      const selectedStock = stocks.find((item) => item.barcode === code);
      setStock(selectedStock || null);
    }
  };

  const handlePrinter = useReactToPrint({
    content: () => printerRef.current,
    pageStyle: `
      @page {
        size: 45mm 35mm;
        margin: 0;
        padding: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .barcode-label {
        width: 45mm;
        height: 35mm;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .print-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, 45mm);
        gap: 1;
      }
    `,
  });

  return (
    <ContentLayout title="Print Label">
      <h1 className="text-xl font-semibold">Select Stock</h1>
      <div className="w-1/2">
        <StockSelector
          stocks={stocks}
          setSelectedStock={barcodeSelected}
          qtyLimit={1}
        />
      </div>

      {stock && (
        <div className="w-full h-full">
          <div className="flex justify-between items-center my-4">
            <label className="flex justify-start items-center gap-2 mt-4">
              <span className="text-sm font-medium">
                Number of Barcodes to Print:
              </span>
              <Input
                type="number"
                className="border rounded-md px-2 py-1 w-16 ml-2"
                min="1"
                max="85"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </label>
            <Button
              className="flex justify-center gap-1 mt-4"
              variant="outline"
              onClick={handlePrinter}
            >
              <Printer size={16} /> Print
            </Button>
          </div>

          <div className="border rounded-md p-4 mb-4 flex justify-start gap-8">
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                checked={nameCheck}
                onClick={() => setNameCheck((prev) => !prev)}
              />
              <span>Name</span>
            </div>
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                checked={variantCheck}
                onClick={() => setVariantCheck((prev) => !prev)}
              />
              <span>Variant</span>
            </div>
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                checked={priceCheck}
                onClick={() => setPriceCheck((prev) => !prev)}
              />
              <span>Price</span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center border p-2">
            <h1 className="text-xs font-bold">
              {process.env.NEXT_PUBLIC_BRAND_NAME}
            </h1>
            {nameCheck && <p className="text-xs font-semibold">{stock.name}</p>}
            {variantCheck && (
              <p className="text-xs font-semibold">
                {stock.colorName} - {stock.sizeName}
              </p>
            )}

            <Barcode
              value={stock.barcode}
              width={2}
              height={25}
              fontSize={10}
            />
            {priceCheck && (
              <p className="text-xs font-semibold">
                PRICE: <span className="font-bold">{stock.selling_price}</span>{" "}
                TK
              </p>
            )}
          </div>

          {/* Bulk Barcode Labels */}
          <div className="hidden">
            <div ref={printerRef} className="">
              {Array.from({ length: quantity }).map((_, index) => (
                <div
                  key={index}
                  className="barcode-label w-full h-full flex flex-col justify-center items-center p-1 border"
                >
                  <h1 className="text-xs font-bold">
                    {process.env.NEXT_PUBLIC_BRAND_NAME}
                  </h1>
                  {/* {nameCheck && (
                    <p className="text-xs font-semibold">{stock.name}</p>
                  )}
                  {variantCheck && (
                    <p className="text-xs font-semibold">
                      {stock.colorName} - {stock.sizeName}
                    </p>
                  )} */}
                  {nameCheck ? (
                    <p className="text-xs font-semibold">{stock.name}</p>
                  ) : (
                    <div className="h-4" />
                  )}

                  {variantCheck ? (
                    <p className="text-xs font-semibold">
                      {stock.colorName} - {stock.sizeName}
                    </p>
                  ) : (
                    <div className="h-4" />
                  )}

                  <Barcode
                    value={stock.barcode}
                    width={2}
                    height={25}
                    fontSize={10}
                  />
                  {/* {priceCheck && (
                    <p className="text-xs font-semibold">
                      PRICE:{" "}
                      <span className="font-bold">{stock.selling_price}</span>{" "}
                      TK
                    </p>
                  )} */}
                  {priceCheck ? (
                    <p className="text-xs font-semibold">
                      PRICE:{" "}
                      <span className="font-bold">{stock.selling_price}</span>{" "}
                      TK
                    </p>
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ContentLayout>
  );
}
