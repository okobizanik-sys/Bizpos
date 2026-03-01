"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const deliveryCharges = [
  {
    value: "60",
    label: "60",
  },
  {
    value: "80",
    label: "80",
  },
  {
    value: "100",
    label: "100",
  },
  {
    value: "120",
    label: "120",
  },
  {
    value: "0",
    label: "0",
  },
];

export function DeliveryChargeComboBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between sm:w-[200px]"
        >
          {value
            ? deliveryCharges.find(
                (deliveryCharge) => deliveryCharge.value === value
              )?.label
            : "Select deliveryCharge..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 sm:w-[200px]">
        <Command>
          <CommandInput placeholder="Search deliveryCharge..." />
          <CommandList>
            <CommandEmpty>No deliveryCharge found.</CommandEmpty>
            <CommandGroup>
              {deliveryCharges.map((deliveryCharge) => (
                <CommandItem
                  key={deliveryCharge.value}
                  value={deliveryCharge.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === deliveryCharge.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {deliveryCharge.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
