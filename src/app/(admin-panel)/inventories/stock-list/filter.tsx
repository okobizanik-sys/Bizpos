"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { StockFilter } from "./page";

const defaultValues = {
  search: "",
  //   category: "",
  //   branch: "",
};

interface FilterStockFormProps {
  currentFilters: StockFilter;
}

export const FilterStockForm: React.FC<FilterStockFormProps> = ({
  currentFilters,
}) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      ...defaultValues,
      ...currentFilters,
    },
  });

  const handleSubmit = (data: any) => {
    const query = new URLSearchParams();

    if (data.search) query.set("search", data.search);

    router.push(`?${query.toString()}`);
  };

  const onReset = () => {
    form.reset(defaultValues);
    router.push("/inventories/stock-list");
  };

  return (
    <Card className="m-6 p-4 rounded-lg mb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex gap-2 items-center justify-between"
        >
          <div className="lg:w-3/4">
            <FormField
              name="search"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search by Name/ Barcode/ SKU/ Price"
                  className="w-full lg:w-1/3"
                />
              )}
            />
          </div>
          <div className="lg:w-1/4 flex gap-2 justify-end items-center">
            <Button type="submit">Apply Filters</Button>
            <Button type="button" variant="outline" onClick={onReset}>
              Reset Filters
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
