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
import { Groups } from "@/types/shared";
import { CustomerFilter } from "../customers-list/page";

const defaultValues = {
  search: "",
  group: "",
};

interface FilterCustomerDataFormProps {
  currentFilters: CustomerFilter;
  groups: Groups[];
}

export const FilterCustomerDataForm: React.FC<FilterCustomerDataFormProps> = ({
  currentFilters,
  groups,
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
    if (data.group) query.set("group", data.group);

    router.push(`?${query.toString()}`);
  };

  const onReset = () => {
    form.reset(defaultValues);
    router.push("/customers/customers-data");
  };

  return (
    <Card className="m-4 p-4 rounded-lg mb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex gap-2 items-center justify-between"
        >
          <div className="w-4/6 flex items-center justify-start gap-2">
            <FormField
              name="search"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search by Customer Name/ Phone"
                  className="w-2/4"
                />
              )}
            />
            <div className="w-1/4">
              <FormField
                name="group"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.name}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="w-2/6 flex gap-2 justify-end items-center">
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
