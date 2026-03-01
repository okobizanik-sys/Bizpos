"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { paymentMethodsFormSchema } from "./form-schema";
import { DeletePaymentMethod, PaymentMethodsFormAction } from "./actions";
import { PaymentMethods } from "@/types/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPaymentMethods } from "@/services/payment-method";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const PaymentMethodsForm: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethods[]>(
    []
  );

  React.useEffect(() => {
    getPaymentMethods().then((data) => setPaymentMethods(data));
  }, [loading]);

  const form = useForm<z.infer<typeof paymentMethodsFormSchema>>({
    resolver: zodResolver(paymentMethodsFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentMethodsFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    try {
      const result = await PaymentMethodsFormAction(formData);
      if (result.success) {
        toast({
          title: "Payment Methods created successfully",
          description: `Payment Methods has been created successfully`,
          variant: "default",
        });
        form.reset();
      }
    } catch (error: any) {
      // console.error(error);
      toast({
        title: "Failed to create payment Methods",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeletePaymentMethod = async (id: number) => {
    try {
      const result = await DeletePaymentMethod(id);
      if (result) {
        toast({
          title: "Payment Methods deleted successfully",
          description: `Payment Methods has been deleted successfully`,
          variant: "default",
        });
        setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
      }
    } catch (error: any) {
      // console.error(error);
      toast({
        title: "Failed to delete payment Methods",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="m-6 mt-3 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-bold">Payment Methods</Label>
          <Button
            variant="outline"
            // size="icon"
            className="border-2 border-green-400 text-green-400"
            onClick={() => setSheetOpen((prev) => !prev)}
          >
            Create Payment Method
          </Button>
        </div>
        <div>
          <div className="flex justify-start items-center gap-4">
            {paymentMethods.map((paymentMethod) => (
              <div
                key={paymentMethod.id}
                className="flex justify-center items-center gap-2 border rounded p-2"
              >
                <span>{paymentMethod.name}</span>
                <div
                  className="text-red-400 hover:text-red-500 cursor-pointer"
                  onClick={() =>
                    handleDeletePaymentMethod(Number(paymentMethod.id))
                  }
                >
                  <Trash2 size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            {/* <MoreHorizontal className="h-4 w-4" /> */}
          </Button>
        </SheetTrigger>
        <SheetContent
          className="sm:max-w-[750px] overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Settings Form</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Methods</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter payment methods name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.name?.message}
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="absolute bottom-0 right-0 m-4 flex gap-2">
                  <Button type="submit" variant="default" loading={loading}>
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
