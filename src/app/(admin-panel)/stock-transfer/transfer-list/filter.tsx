"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { createRef } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { format } from "date-fns";
import { filterSubmitAction } from "./action";
import { Card } from "@/components/ui/card";

const defaultValues = {
  challan: "",
  status: "",
  start_date: format(new Date(), "yyyy-MM-dd"),
  end_date: format(new Date(), "yyyy-MM-dd"),
};

export const FilterTransferListForm: React.FC = () => {
  const ref = createRef<HTMLFormElement>();
  const router = useRouter();

  const form = useForm({ defaultValues });

  const onReset = () => {
    form.reset(defaultValues);
    router.push("/stock-transfer/transfer-list");
  };

  return (
    <Card className="m-4 p-4 rounded-md">
      <Form {...form}>
        <form
          ref={ref}
          action={filterSubmitAction}
          className="w-full flex gap-2 items-center justify-between"
        >
          <div className="w-4/6 flex justify-between items-end gap-2">
            <FormField
              name="challan"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="flex-1"
                  placeholder="Challan code"
                />
              )}
            />
            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select
                  name="status"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"PENDING"}>PENDING</SelectItem>
                    <SelectItem value={"RECEIVED"}>RECEIVED</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <FormField
              name="start_date"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <span className="text-xs">From Date</span>
                  <Input type="date" {...field} />
                </div>
              )}
            />

            <FormField
              name="end_date"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <span className="text-xs">To Date</span>
                  <Input type="date" {...field} />
                </div>
              )}
            />
          </div>
          <div className="w-2/6 flex justify-end items-center gap-2">
            <SubmitButton>Apply Filter</SubmitButton>
            <Button type="button" variant="outline" onClick={onReset}>
              Clear Filter
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
