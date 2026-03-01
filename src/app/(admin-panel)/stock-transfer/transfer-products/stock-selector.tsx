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
}

export const StockSelector: React.FC<Props> = ({
  stocks,
  setSelectedStock,
  qtyLimit,
}) => {
  // console.log(qtyLimit, 'from stock selector');

  return (
    <ControlledCombobox
      value={null}
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
      <ComboboxInput placeholder="Enter Product ID/SKU/Name or Barcode" />
      <ComboboxContent>
        {stocks.map(({ barcode, name, sku, colorName, sizeName }) => (
          <ComboboxItem
            key={barcode}
            value={barcode}
            label={`${barcode} - ${name} - ${sku}`}
            className="ps-8"
          >
            <span className="text-sm text-foreground flex gap-2">
              <b>Barcode: {barcode}</b>
              <span>{name}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              SKU: {sku}, Variant: {colorName} - {sizeName}
            </span>
          </ComboboxItem>
        ))}
        <ComboboxEmpty>No results.</ComboboxEmpty>
      </ComboboxContent>
    </ControlledCombobox>
  );
};
