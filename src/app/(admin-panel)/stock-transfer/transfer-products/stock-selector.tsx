"use client";

import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ControlledCombobox,
} from "@/components/ui/controlled-combo-box";
import React from "react";
import { StockPayload } from "./transfer-layout";

interface Props {
  stocks: StockPayload[];
  setSelectedStock: (value: string | null) => void;
  qtyLimit: number;
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
  emptyMessage?: string;
}

export const StockSelector: React.FC<Props> = ({
  stocks,
  setSelectedStock,
  value,
  disabled,
  placeholder = "Enter Product ID/SKU/Name or Barcode",
  emptyMessage = "No stock found.",
}) => {
  return (
    <ControlledCombobox
      value={value}
      onValueChange={setSelectedStock}
      filterItems={(inputValue, items) => {
        const q = inputValue.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
          ({ label, value }) =>
            label.toLowerCase().includes(q) || value.toLowerCase().includes(q)
        );
      }}
    >
      <ComboboxInput placeholder={placeholder} disabled={disabled} />
      <ComboboxContent>
        {stocks.map(({ barcode, name, sku, colorName, sizeName, productId }) => (
          <ComboboxItem
            key={barcode}
            value={barcode}
            label={`${productId} ${barcode} ${name} ${sku} ${colorName || ""} ${sizeName || ""}`}
            className="ps-8"
          >
            <span className="text-sm text-foreground flex flex-wrap gap-2">
              <b>Barcode: {barcode}</b>
              <span>{name}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Product ID: {productId}, SKU: {sku}, Variant: {colorName || "-"} -{" "}
              {sizeName || "-"}
            </span>
          </ComboboxItem>
        ))}
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
      </ComboboxContent>
    </ControlledCombobox>
  );
};
