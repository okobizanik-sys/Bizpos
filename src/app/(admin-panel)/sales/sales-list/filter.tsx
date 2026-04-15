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
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";

const defaultValues = {
  search: "",
  saleChannel: "ALL",
  fromDate: undefined,
  toDate: undefined,
};

interface FilterSalesFormProps {
  currentFilters: {
    search?: string;
    saleChannel?: string;
    fromDate?: Date;
    toDate?: Date;
  };
}

export const FilterSalesForm: React.FC<FilterSalesFormProps> = ({
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
    if (data.saleChannel && data.saleChannel !== "ALL") {
      query.set("saleChannel", data.saleChannel);
    }
    if (data.fromDate)
      query.set("fromDate", new Date(data.fromDate).toISOString());
    if (data.toDate) query.set("toDate", new Date(data.toDate).toISOString());

    router.push(`?${query.toString()}`);
  };

  const onReset = () => {
    form.reset(defaultValues);
    router.push("/sales/sales-list");
  };

  return (
    <Card className="m-4 p-4 rounded-lg mb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-wrap items-center justify-between gap-2"
        >
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <FormField
              name="search"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search by Order ID/Customer Name/Phone"
                  className="min-w-[240px] flex-1"
                />
              )}
            />

            <FormField
              name="saleChannel"
              control={form.control}
              render={({ field }) => (
                <div className="min-w-[160px]">
                  <Select
                    value={String(field.value || "ALL")}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sale Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Sales</SelectItem>
                      <SelectItem value="OFFLINE">Offline</SelectItem>
                      <SelectItem value="ONLINE">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <FormField
              name="fromDate"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  placeholderText="From Date"
                  className="min-w-[160px]"
                />
              )}
            />
            <FormField
              name="toDate"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  placeholderText="To Date"
                  className="min-w-[160px]"
                />
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <SubmitButton>Search</SubmitButton>
            <Button type="button" variant="outline" onClick={onReset}>
              Reset Filters
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
