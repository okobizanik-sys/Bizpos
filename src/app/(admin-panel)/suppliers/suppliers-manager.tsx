"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Supplier } from "@/types/shared";
import { createSupplierAction, deleteSupplierAction } from "./actions";

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
  suppliers: Supplier[];
}

export const SuppliersManager: React.FC<Props> = ({ suppliers }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const form = useForm<z.infer<typeof supplierFormSchema>>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof supplierFormSchema>) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("email", values.email || "");
      formData.set("phone", values.phone || "");
      formData.set("address", values.address || "");

      await createSupplierAction(formData);
      toast({ title: "Supplier created successfully" });
      form.reset();
      setSheetOpen(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Failed to create supplier",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplierAction(id);
      toast({ title: "Supplier deleted successfully" });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Failed to delete supplier",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="m-4 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Suppliers</h2>
          <Button
            variant="outline"
            className="border-2 border-green-400 text-green-500"
            onClick={() => setSheetOpen((prev) => !prev)}
          >
            Add Supplier
          </Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {suppliers.length ? (
            suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold">{supplier.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {supplier.email || "No email"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {supplier.phone || "No mobile"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {supplier.address || "No address"}
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-2">
                      <Link href={`/suppliers/${supplier.id}`}>View Profile</Link>
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(Number(supplier.id))}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4 text-sm text-muted-foreground">
              No suppliers yet.
            </Card>
          )}
        </div>
      </Card>

      <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="hidden" />
        </SheetTrigger>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Supplier</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter supplier name" />
                    </FormControl>
                    <FormDescription className="text-xs text-red-400 min-h-4">
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
                    <FormDescription className="text-xs text-red-400 min-h-4">
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
                  Save Supplier
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};
