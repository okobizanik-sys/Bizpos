"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFormAction } from "./actions";

const defaultValues = {
  name: "",
  address: "",
  phone: "",
};

export const CreateBranchForm: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const branchFormSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
  });

  const form = useForm<z.infer<typeof branchFormSchema>>({
    resolver: zodResolver(branchFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof branchFormSchema>) => {
    setLoading(true);
    try {
      await createFormAction(values);
      form.reset();
      toast({
        title: "Success",
        description: "Branch created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2 py-2 md:grid-cols-2 xl:grid-cols-4 items-end"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Branch Name <b className="text-red-500">*</b>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter branch name" {...field} />
              </FormControl>
              <FormDescription className="text-red-400 text-xs min-h-4">
                {form.formState.errors.name?.message}
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Branch Address <b className="text-red-500">*</b>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter branch address" {...field} />
              </FormControl>
              <FormDescription className="text-red-400 text-xs min-h-4">
                {form.formState.errors.address?.message}
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number <b className="text-red-500">*</b>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormDescription className="text-red-400 text-xs min-h-4">
                {form.formState.errors.phone?.message}
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" loading={loading} className="mb-6">
          Create Branch
        </Button>
      </form>
    </Form>
  );
};
