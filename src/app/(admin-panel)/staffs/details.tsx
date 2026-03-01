"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ImagePlus, MoreHorizontal, TrashIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FileInput, FileUploader } from "@/components/ui/file-uploader";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { makeFormData } from "@/utils/helpers";
import { useToast } from "@/components/ui/use-toast";
import { confirmation } from "@/components/modals/confirm-modal";
import { getBranches } from "@/services/branch";
import { Branches, User } from "@/types/shared";
import { stafFormSchema } from "./form-schema";
import { roles } from "./form";
import { deleteStaffOnConfirmed, updateStaffFormAction } from "./action";

interface Props {
  user: User;
}

export function StaffDetailSheet({ user }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [branches, setBranches] = useState<Branches[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof stafFormSchema>>({
    resolver: zodResolver(stafFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: user.password,
      designation: user.role,
      phone: user.phone || "",
      branchId: String(user.branchId) || "",
    },
  });

  useEffect(() => {
    getBranches().then((data) => {
      setBranches(data);
    });
  }, [sheetOpen]);

  const onSubmitUpdate = async (values: z.infer<typeof stafFormSchema>) => {
    setUpdating(true);
    const formData = makeFormData(values);

    try {
      const updatedStaff = await updateStaffFormAction(
        Number(user.id),
        formData
      );
      if (updatedStaff) {
        toast({
          title: "Staff updated successfully",
          description: `Staff has been updated successfully`,
          variant: "default",
        });
        setSheetOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    }
    setUpdating(false);
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this user?")) {
      setDeleting(true);
      const deletedStaff = await deleteStaffOnConfirmed(Number(user.id));
      if (deletedStaff) {
        toast({
          title: "Staff deleted successfully",
          description: `Staff has been deleted successfully`,
          variant: "default",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
  };

  return (
    <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full overflow-y-auto sm:max-w-[750px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Staff Details</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="my-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3"
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem
                              key={branch.id}
                              value={String(branch.id)}
                            >
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
            <div className="absolute bottom-0 right-0 m-4 flex gap-2">
              <Button type="submit" variant="default" loading={updating}>
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                loading={deleting}
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
