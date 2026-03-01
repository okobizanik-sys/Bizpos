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
import { CustomerFilter } from "./page";
import { Groups, Memberships } from "@/types/shared";

const defaultValues = {
  search: "",
  group: "",
  membership: "",
};

interface FilterCustomerFormProps {
  currentFilters: CustomerFilter;
  groups: Groups[];
  memberships: Memberships[];
}

export const FilterCustomerForm: React.FC<FilterCustomerFormProps> = ({
  currentFilters,
  groups,
  memberships,
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
    if (data.membership) query.set("membership", data.membership);

    router.push(`?${query.toString()}`);
  };

  const onReset = () => {
    form.reset(defaultValues);
    router.push("/customers/customers-list");
  };

  return (
    <Card className="m-4 p-4 rounded-lg mb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full flex gap-2 items-center justify-between"
        >
          <div className="w-4/6 flex justify-start items-center gap-2">
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
            <div className="w-1/4">
              <FormField
                name="membership"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Membership" />
                    </SelectTrigger>
                    <SelectContent>
                      {memberships.map((membership) => (
                        <SelectItem key={membership.id} value={membership.type}>
                          {membership.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="w-2/6 flex justify-end items-center gap-2">
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
