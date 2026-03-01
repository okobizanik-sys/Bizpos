"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { BarcodeLabel } from "@/components/BarcodeLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface PrintLabelClientProps {
  productId: number;
  productName: string;
  sellingPrice: number;
  /** All stock variants for this product — each has the real stocks.barcode */
  stocks: Array<{ barcode: string; colorName: string; sizeName: string }>;
  mrp?: number;
}

const PRINTER_PRESETS = [
  {
    key: "58mm",
    label: "58mm Roll",
    desc: "Small / mobile thermal printer",
    pageWidth: "58mm",
    pageHeight: "auto",
    cols: 1,
    labelWidth: "54mm",
    labelHeight: "30mm",
  },
  {
    key: "80mm",
    label: "80mm Roll",
    desc: "Supermarket / high-volume POS",
    pageWidth: "80mm",
    pageHeight: "auto",
    cols: 1,
    labelWidth: "76mm",
    labelHeight: "38mm",
  },
  {
    key: "a4-2col",
    label: "A4 - 2 col",
    desc: "Office label sheet, 2 across",
    pageWidth: "210mm",
    pageHeight: "297mm",
    cols: 2,
    labelWidth: "99mm",
    labelHeight: "42mm",
  },
  {
    key: "a4-3col",
    label: "A4 - 3 col",
    desc: "Office label sheet, 3 across",
    pageWidth: "210mm",
    pageHeight: "297mm",
    cols: 3,
    labelWidth: "65mm",
    labelHeight: "38mm",
  },
] as const;

type PresetKey = (typeof PRINTER_PRESETS)[number]["key"];

export default function PrintLabelClient({
  productName,
  sellingPrice,
  stocks,
  mrp,
}: PrintLabelClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [presetKey, setPresetKey] = useState<PresetKey>("58mm");
  // Default to the first stock variant's barcode
  const [selectedBarcode, setSelectedBarcode] = useState<string>(
    stocks[0]?.barcode ?? "",
  );

  const printRef = useRef<HTMLDivElement>(null);

  const preset = PRINTER_PRESETS.find((p) => p.key === presetKey)!;
  const isRoll = preset.pageHeight === "auto";

  const companyName =
    process.env.NEXT_PUBLIC_COMPANY_NAME ||
    process.env.NEXT_PUBLIC_BRAND_NAME ||
    "YOUR COMPANY";

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: ${preset.pageWidth} ${preset.pageHeight};
        margin: 0;
      }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; }
      .print-sheet.roll-mode {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: ${preset.pageWidth};
        margin: 0;
        padding: 0;
      }
      .print-sheet.roll-mode .label-wrapper {
        width: ${preset.labelWidth};
        min-height: ${preset.labelHeight};
        height: auto;
        padding: 2mm;
        page-break-inside: avoid;
        break-inside: avoid;
        page-break-after: avoid;
        break-after: avoid;
      }
      .print-sheet.grid-mode {
        display: grid;
        grid-template-columns: repeat(${preset.cols}, ${preset.labelWidth});
        width: ${preset.pageWidth};
        margin: 0;
        padding: 0;
      }
      .print-sheet.grid-mode .label-wrapper {
        width: ${preset.labelWidth};
        height: ${preset.labelHeight};
        padding: 2mm;
        overflow: hidden;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1px;
        width: 100%;
        height: 100%;
      }
      .label svg { max-width: 100%; max-height: 16mm; display: block; }
      .company { font-size: 7pt; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2; }
      .product-name { font-size: 6pt; text-align: center; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; line-height: 1.2; }
      .price-row { display: flex; align-items: center; gap: 4px; font-size: 6pt; margin: 0; line-height: 1.2; }
      .mrp { text-decoration: line-through; color: #555; }
      .sale { font-weight: bold; }
    `,
  });

  return (
    <div className="p-6 max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/inventories/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">{productName}</h1>
      </div>

      <div className="grid gap-5">
        {/* Variant selector — only shown when product has multiple stock barcodes */}
        {stocks.length > 1 && (
          <div>
            <p className="text-sm font-medium mb-2">Variant / Barcode</p>
            <div className="flex flex-col gap-1.5">
              {stocks.map((s) => {
                const label = [s.colorName, s.sizeName]
                  .filter((v) => v && v !== "-")
                  .join(" - ");
                return (
                  <button
                    key={s.barcode}
                    type="button"
                    onClick={() => setSelectedBarcode(s.barcode)}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                      selectedBarcode === s.barcode
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className="text-sm font-semibold font-mono">
                      {s.barcode}
                    </span>
                    {label && (
                      <span className="text-xs text-muted-foreground">
                        {label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Printer / paper size</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRINTER_PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPresetKey(p.key)}
                className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors ${
                  presetKey === p.key
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span className="text-sm font-semibold">{p.label}</span>
                <span className="text-xs text-muted-foreground leading-tight mt-0.5">
                  {p.desc}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isRoll
              ? `Continuous roll — labels feed one after another. Width: ${preset.pageWidth}.`
              : `Sheet — labels tile in a ${preset.cols}-column grid across A4 pages.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">Copies:</p>
          <button
            type="button"
            className="w-7 h-7 rounded border text-base leading-none hover:bg-muted"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <Input
            type="number"
            className="w-20 text-center"
            min={1}
            max={500}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(500, parseInt(e.target.value) || 1)),
              )
            }
          />
          <button
            type="button"
            className="w-7 h-7 rounded border text-base leading-none hover:bg-muted"
            onClick={() => setQuantity((q) => Math.min(500, q + 1))}
          >
            +
          </button>
          <Button onClick={handlePrint} className="ml-2 gap-2">
            <Printer size={16} />
            Print {quantity} label{quantity !== 1 ? "s" : ""}
          </Button>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Preview (1 label)</p>
          <div className="inline-block border rounded-md p-3 bg-white">
            <BarcodeLabel
              companyName={companyName}
              productName={productName}
              sellingPrice={sellingPrice}
              mrp={mrp}
              barcodeString={selectedBarcode}
            />
          </div>
        </div>

        <div className="rounded-md border bg-muted/40 px-4 py-3 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">
            How to print on your thermal printer:
          </p>
          <p>
            1. Connect your thermal printer and make sure it is set as the
            default printer in Windows.
          </p>
          <p>2. Click Print above - Chrome will open the print dialog.</p>
          <p>
            3. Under Destination, select your thermal printer (not Save as PDF).
          </p>
          <p>
            4. Under More settings, Paper size - pick the size matching your
            roll ({preset.pageWidth}).
          </p>
          <p>5. Set Margins to None and uncheck Headers and footers.</p>
          <p>6. Click Print - labels will feed continuously on the roll.</p>
          {isRoll && (
            <p className="text-amber-600 font-medium pt-1">
              If your thermal printer is not listed, install its driver from the
              manufacturer website first (e.g. Xprinter, EPSON, Star).
            </p>
          )}
        </div>
      </div>

      <div className="hidden">
        <div
          ref={printRef}
          className={`print-sheet ${isRoll ? "roll-mode" : "grid-mode"}`}
        >
          {Array.from({ length: quantity }).map((_, i) => (
            <BarcodeLabel
              key={i}
              companyName={companyName}
              productName={productName}
              sellingPrice={sellingPrice}
              mrp={mrp}
              barcodeString={selectedBarcode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
