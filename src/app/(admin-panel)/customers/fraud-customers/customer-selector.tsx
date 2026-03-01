"use client";

import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ControlledCombobox,
} from "@/components/ui/controlled-combo-box";
import { Customers } from "@/types/shared";
import React from "react";

interface Props {
  customers: Customers[];
  setSelectedCustomer: (value: string | null) => void;
}

export const CustomerSelector: React.FC<Props> = ({
  customers,
  setSelectedCustomer,
}) => {
  // console.log(, 'from customer selector');

  return (
    <ControlledCombobox
      value={null}
      onValueChange={setSelectedCustomer}
      filterItems={(inputValue, items) =>
        items.filter(({ value }) => {
          const customer = customers.find(
            (customer) => String(customer.id) === value
          );
          return (
            !inputValue ||
            (customer &&
              (customer.customer
                .toLowerCase()
                .includes(inputValue.toLowerCase()) ||
                customer.phone
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())))
          );
        })
      }
    >
      <ComboboxInput placeholder="Enter Customer Name/ Phone" />
      <ComboboxContent>
        {customers.map(({ id, customer, phone, address }) => (
          <ComboboxItem
            key={id}
            value={String(id)}
            label={`${id} - ${customer} - ${phone}`}
            className="ps-8"
          >
            <span className="text-sm text-foreground flex gap-2">
              <b>Phone: {phone}</b>
              <span>{customer}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              ID: {id}, Address: {address}
            </span>
          </ComboboxItem>
        ))}
        <ComboboxEmpty>No results.</ComboboxEmpty>
      </ComboboxContent>
    </ControlledCombobox>
  );
};
