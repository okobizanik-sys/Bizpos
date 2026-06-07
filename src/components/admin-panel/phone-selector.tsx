




"use client";

import React, { useState } from "react";
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ControlledCombobox,
} from "@/components/ui/controlled-combo-box";
import { Customers } from "@/types/shared";

interface PhoneSelectorProps {
  customers: Customers[];
  value?: string;
  onChange?: (value: string) => void;
  setSelectedCustomer?: (customer: Customers | null) => void;
}

export const PhoneSelector: React.FC<PhoneSelectorProps> = ({
  customers,
  value,
  onChange,
  setSelectedCustomer,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  const handleCustomerSelect = (customerId: string | null) => {
    setSelectedCustomerId(customerId);

    if (customerId) {
      const selectedCustomer = customers.find(
        (c) => String(c.id) === customerId
      );

      if (selectedCustomer) {
        setInputValue(selectedCustomer.phone);

        setSelectedCustomer?.(selectedCustomer);

        onChange?.(selectedCustomer.phone);
      }
    } else {
      setSelectedCustomer?.(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    setSelectedCustomerId(null);
    setSelectedCustomer?.(null);

    onChange?.(newValue);
  };

  return (
    <ControlledCombobox
      value={selectedCustomerId}
      onValueChange={handleCustomerSelect}
      filterItems={(inputValue, items) =>
        items.filter(({ value }) => {
          const customer = customers.find(
            (customer) => String(customer.id) === value
          );
          return (
            !inputValue ||
            (customer &&
              customer.phone.toLowerCase().includes(inputValue.toLowerCase()))
          );
        })
      }




    >
      <ComboboxInput
        placeholder="Enter Customer Phone"
        value={inputValue}
        onChange={handleInputChange}
        type="text"
      />
      <ComboboxContent>
        {customers.map((item) => (
          <ComboboxItem
            key={item.id}
            value={String(item.id)}
            label={`${item.phone} - ${item.customer}`}
            className="p-2"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                <b>Phone:</b> {item.phone}
              </span>
              <span className="text-sm text-muted-foreground">
                <b>Name:</b> {item.customer}
              </span>
              <span className="text-xs text-muted-foreground">
                ID: {item.id}, Address: {item.address}
              </span>
            </div>
          </ComboboxItem>
        ))}
        <ComboboxEmpty>No customers found.</ComboboxEmpty>
      </ComboboxContent>
    </ControlledCombobox>
  );
};
