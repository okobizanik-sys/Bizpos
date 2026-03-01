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
import {
  SheetTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteBranchAction, updateFormAction } from "./actions";
import { confirmation } from "@/components/modals/confirm-modal";
import { Branches } from "@/types/shared";

interface Props {
  branch: Branches;
}

export const BranchDetailsSheet: React.FC<Props> = ({ branch }) => {
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const branchFormSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
  });
  // console.log(branch, "branch from colum detail");
  const form = useForm<z.infer<typeof branchFormSchema>>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
    },
  });

  const onSubmitUpdate = async (data: z.infer<typeof branchFormSchema>) => {
    setUpdating(true);
    try {
      await updateFormAction(Number(branch.id), data);
      toast({
        title: "Branch updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update branch",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this branch?")) {
      setDeleting(true);
      const deleted = await deleteBranchAction(Number(branch.id));
      if (deleted) {
        toast({
          title: "Branch deleted successfully",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-[750px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Branch Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitUpdate)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    Branch Name <b>*</b>
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
                <FormItem className="col-span-2">
                  <FormLabel>
                    Branch Address <b>*</b>
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
                <FormItem className="col-span-2">
                  <FormLabel>
                    Phone Number <b>*</b>
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

            <div className="absolute bottom-0 right-0 m-4 flex gap-2">
              <Button type="submit" variant="default" loading={updating}>
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                loading={deleting}
                disabled={branch.root}
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
