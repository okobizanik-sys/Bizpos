"use client";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { handleSearch } from "./action";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const defaultValues = {
  start_date: format(new Date(), "yyyy-MM-dd"),
  end_date: format(new Date(), "yyyy-MM-dd"),
};

export const FilterForm = () => {
  const router = useRouter();
  const form = useForm({ defaultValues });

  const onReset = () => {
    form.reset(defaultValues);
    router.push("/inventories/stock-history");
  };

  return (
    <Form {...form}>
      <form action={handleSearch} className="my-4 flex gap-2 items-end">
        <div className="w-3/4 flex items-center justify-start gap-2">
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
        <div className="w-1/4 flex gap-2 justify-end items-center">
          <SubmitButton>Search</SubmitButton>
          <Button type="button" variant="outline" onClick={onReset}>
            Clear Filter
          </Button>
        </div>
      </form>
    </Form>
  );
};
