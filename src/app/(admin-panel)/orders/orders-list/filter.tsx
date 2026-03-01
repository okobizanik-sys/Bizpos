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
  status: "",
  fromDate: undefined,
  toDate: undefined,
};

interface FilterOrderFormProps {
  currentFilters: {
    search?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
  };
}

export const FilterOrderForm: React.FC<FilterOrderFormProps> = ({
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
    if (data.status) query.set("status", data.status);
    if (data.fromDate)
      query.set("fromDate", new Date(data.fromDate).toISOString());
    if (data.toDate) query.set("toDate", new Date(data.toDate).toISOString());

    router.push(`?${query.toString()}`);
  };

  const onReset = () => {
    form.reset(defaultValues);
    router.push("/orders/orders-list");
  };

  return (
    <Card className="m-6 p-4 rounded-lg mb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full flex gap-2 items-center justify-between"
        >
          <div className="w-4/6 flex justify-between items-center gap-2">
            <FormField
              name="search"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search by Order ID/Customer Name/Phone"
                  className="w-2/5"
                />
              )}
            />
            <div className="w-1/5">
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="EXCHANGED">Exchanged</SelectItem>
                      {/* <SelectItem value="RETURN">Returned</SelectItem> */}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FormField
              name="fromDate"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  placeholderText="From Date"
                  className="w-1/5"
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
                  className="w-1/5"
                />
              )}
            />
          </div>
          <div className="w-2/6 flex justify-end items-center gap-2">
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
