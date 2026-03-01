"use client";

import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ControlledCombobox,
} from "@/components/ui/controlled-combo-box";
import { ChallanGetPayload, Challans } from "@/types/shared";
import React from "react";

interface Props {
  challans: Challans[];
  setSelectedChallan: (value: string | null) => void;
}

export const ChallanSelector: React.FC<Props> = ({
  challans,
  setSelectedChallan,
}) => {
  return (
    <ControlledCombobox
      value={null}
      onValueChange={setSelectedChallan}
      filterItems={(inputValue, items) =>
        items.filter(({ value }) => {
          const challan = challans.find(
            (challan) => challan.challan_no === value
          );
          return (
            !inputValue ||
            (challan &&
              String(challan.challan_no)
                .toLowerCase()
                .includes(inputValue.toLowerCase()))
          );
        })
      }
    >
      <ComboboxInput placeholder="Enter Challan No." />
      <ComboboxContent>
        {challans.map(({ id, challan_no }) => (
          <ComboboxItem
            key={id}
            value={String(challan_no)}
            label={`${challan_no} - ${name}`}
            className="ps-8"
          >
            <span className="text-sm text-foreground flex gap-2">
              <b>Challan No.: {challan_no}</b>
              <span>{id}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {/* ID: {productId.toString()}, SKU: {sku}, Variant: {colorName} -{" "}
                {sizeName}, Stocks:{} */}
            </span>
          </ComboboxItem>
        ))}
        <ComboboxEmpty>No results.</ComboboxEmpty>
      </ComboboxContent>
    </ControlledCombobox>
  );
};
