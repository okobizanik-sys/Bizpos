"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { updateSupplierAction } from "../actions";
import type { Supplier } from "@/types/shared";

const supplierFormSchema = z.object({
  name: z.string().min(1, "Supplier name is required."),
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Invalid email address.",
    }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

interface Props {
  supplier: Supplier;
}

export default function SupplierProfileForm({ supplier }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof supplierFormSchema>>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof supplierFormSchema>) => {
    if (!supplier.id) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("email", values.email || "");
      formData.set("phone", values.phone || "");
      formData.set("address", values.address || "");

      await updateSupplierAction(Number(supplier.id), formData);
      toast({ title: "Supplier updated successfully" });
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Failed to update supplier",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-4 lg:col-span-1">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Supplier Info</h3>
        {isEditing ? (
          <Button type="button" size="sm" variant="ghost" onClick={handleCancel}>
            <X size={16} className="mr-1" />
            Cancel
          </Button>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil size={16} className="mr-1" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter supplier name" />
                  </FormControl>
                  <FormDescription className="min-h-4 text-xs text-red-400">
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter supplier email" />
                  </FormControl>
                  <FormDescription className="min-h-4 text-xs text-red-400">
                    {form.formState.errors.email?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter supplier mobile" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter supplier address" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Name:</span> {supplier.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {supplier.email || "No email"}
          </p>
          <p>
            <span className="font-medium">Mobile:</span> {supplier.phone || "No mobile"}
          </p>
          <p>
            <span className="font-medium">Address:</span> {supplier.address || "No address"}
          </p>
        </div>
      )}
    </Card>
  );
}
