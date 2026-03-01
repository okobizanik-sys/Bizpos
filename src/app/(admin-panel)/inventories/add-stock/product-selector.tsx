"use client";

import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ControlledCombobox,
} from "@/components/ui/controlled-combo-box";
import { CheckIcon } from "lucide-react";
import React from "react";
import { ProductList } from "../products/columns";

interface Props {
  products: ProductList[];
  selectedProduct: string | null;
  setSelectProduct: (value: string | null) => void;
}

export const ProductSelector: React.FC<Props> = ({
  products,
  selectedProduct,
  setSelectProduct,
}) => {
  return (
    <ControlledCombobox
      value={selectedProduct}
      onValueChange={setSelectProduct}
      filterItems={(inputValue, items) =>
        items.filter(({ value }) => {
          const product = products.find(
            (product) => product.id.toString() === value
          );
          return (
            !inputValue ||
            (product &&
              (product.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                product.sku.toLowerCase().includes(inputValue.toLowerCase()) ||
                product.id.toString().includes(inputValue.toLowerCase())))
          );
        })
      }
    >
      <ComboboxInput placeholder="Enter Product ID/SKU/Name..." />
      <ComboboxContent>
        {products.map(({ id, name, sku }) => (
          <ComboboxItem
            key={id}
            value={id.toString()}
            label={name}
            className="ps-8"
          >
            <span className="text-sm text-foreground">{name}</span>
            <span className="text-xs text-muted-foreground">
              ID: {id}, SKU: {sku}
            </span>
            {selectedProduct === id.toString() && (
              <span className="absolute start-2 top-0 flex h-full items-center justify-center">
                <CheckIcon className="size-4" />
              </span>
            )}
          </ComboboxItem>
        ))}
        <ComboboxEmpty>No results.</ComboboxEmpty>
      </ComboboxContent>
    </ControlledCombobox>
  );
};
