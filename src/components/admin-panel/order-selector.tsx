"use client";

import React from "react";
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ControlledCombobox,
} from "@/components/ui/controlled-combo-box";
import { OrderWithItem } from "@/app/(admin-panel)/pos/item-selector";

interface OrderSelectorProps {
  setSelectedOrder: (value: string | null) => void;
  orders?: OrderWithItem[] | null;
}

export const OrderSelector: React.FC<OrderSelectorProps> = ({
  orders,
  setSelectedOrder,
}) => {
  return (
    <ControlledCombobox
      value={null}
      onValueChange={setSelectedOrder}
      filterItems={(inputValue, items) => {
        const q = inputValue.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
          ({ label, value }) =>
            label.toLowerCase().includes(q) || value.toLowerCase().includes(q)
        );
      }}
    >
      <ComboboxInput placeholder="Enter Order ID / Phone" />
      <ComboboxContent>
        {orders?.map((order) => (
          <ComboboxItem
            key={order.ordersId}
            value={order.orderId}
            label={`${order.orderId}-${order.phone}`}
            className="ps-8"
          >
            <span className="text-sm text-foreground flex flex-col gap-2">
              <b>Order ID: {order.orderId}</b>
              <span>Phone: {order.phone}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {/* Phone: {order.customer?.phone}, Total Items:{" "} */}
              {/* {order.orderItems.length} */}
            </span>
          </ComboboxItem>
        ))}
        <ComboboxEmpty>No results found.</ComboboxEmpty>
      </ComboboxContent>
    </ControlledCombobox>
  );
};
