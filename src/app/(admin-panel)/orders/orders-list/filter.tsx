"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  saleChannel: "ALL",
  fromDate: undefined,
  toDate: undefined,
};

interface FilterOrderFormProps {
  currentFilters: {
    search?: string;
    status?: string;
    saleChannel?: string;
    fromDate?: Date;
    toDate?: Date;
  };
}

export const FilterOrderForm: React.FC<FilterOrderFormProps> = ({
  currentFilters,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    defaultValues: {
      ...defaultValues,
      ...currentFilters,
    },
  });

  const handleSubmit = (data: any) => {
    const query = new URLSearchParams(searchParams?.toString());

    if (data.search) query.set("search", data.search);
    else query.delete("search");

    if (data.status) query.set("status", data.status);
    else query.delete("status");

    if (data.saleChannel && data.saleChannel !== "ALL") {
      query.set("saleChannel", data.saleChannel);
    } else {
      query.delete("saleChannel");
    }

    if (data.fromDate) {
      query.set("fromDate", new Date(data.fromDate).toISOString());
    } else {
      query.delete("fromDate");
    }

    if (data.toDate) {
      query.set("toDate", new Date(data.toDate).toISOString());
    } else {
      query.delete("toDate");
    }

    query.set("page", "1");

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
            <div className="min-w-[160px]">
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
            <div className="min-w-[160px]">
              <FormField
                name="saleChannel"
                control={form.control}
                render={({ field }) => (
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
