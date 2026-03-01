"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { stafFormSchema } from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeFormData } from "@/utils/helpers";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Branches } from "@/types/shared";
import { staffSettingsAction } from "./action";
import { Card } from "@/components/ui/card";

interface Props {
  branches: Branches[];
}

const defaultValues = {
  name: "",
  email: "",
  password: "",
  designation: "STAFF",
  phone: "",
  branchId: "",
};

export const roles = [
  {
    id: "1",
    role: "STAFF",
    name: "Staff",
  },
  {
    id: "2",
    role: "ADMIN",
    name: "Admin",
  },
];

export const StaffForm: React.FC<Props> = ({ branches }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof stafFormSchema>>({
    resolver: zodResolver(stafFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof stafFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    try {
      const result = await staffSettingsAction(formData);
      if (result) {
        toast({
          title: "Staff created successfully",
          description: `Staff has been created successfully`,
          variant: "default",
        });
        form.reset();
      }
    } catch (error: any) {
      // console.error(error);
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <Card className="m-6 p-4 rounded-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter staff name" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.name?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <b className="text-red-500">*</b>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter staff email" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.email?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <b className="text-red-500">*</b>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter password" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.password?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.phone?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <div className="flex items-end gap-2 w-full">
                <FormItem className="flex-1">
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={String(role.role)}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-red-400 text-xs min-h-4">
                    {form.formState.errors.designation?.message}
                  </FormDescription>
                </FormItem>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="branchId"
            render={({ field }) => (
              <div className="flex items-end gap-2 w-full">
                <FormItem className="flex-1">
                  <FormLabel>
                    Branch <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={String(branch.id)}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-red-400 text-xs min-h-4">
                    {form.formState.errors.branchId?.message}
                  </FormDescription>
                </FormItem>
              </div>
            )}
          />

          <div className="flex flex-col gap-2 mt-4 col-start-4">
            <Button type="submit" variant="default" loading={loading}>
              Add Staff
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
