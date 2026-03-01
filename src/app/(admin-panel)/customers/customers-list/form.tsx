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
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFormAction } from "./action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SquarePlus } from "lucide-react";
import { AddGroupModal } from "@/components/modals/add-group-modal";
import { AddMembershipModal } from "@/components/modals/add-membership-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Groups, Memberships } from "@/types/shared";

type AddCustomerModalProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  groups: Groups[];
  memberships: Memberships[];
};

const defaultValues = {
  customer: "",
  address: "",
  phone: "",
  groupId: "",
  membershipId: "",
};

export const CreateCustomerForm: React.FC<AddCustomerModalProps> = ({
  groups,
  memberships,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [openAddGroup, setOpenAddGroup] = React.useState(false);
  const [openAddMembership, setOpenAddMembership] = React.useState(false);

  const customerFormSchema = z.object({
    customer: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    groupId: z.string(),
    membershipId: z.string(),
  });

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    setLoading(true);
    try {
      await createFormAction(values);
      form.reset();
      toast({
        title: "Success",
        description: "Customer created successfully",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Customer Name <b>*</b>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormDescription className="text-red-400 text-xs min-h-4">
                    {form.formState.errors.customer?.message}
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
                    Customer Address <b>*</b>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer address" {...field} />
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

            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <div className="flex items-end gap-2 w-full">
                  <FormItem className="flex-1">
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={String(group.id)}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.groupId?.message}
                    </FormDescription>
                  </FormItem>
                  <Button
                    type="button"
                    onClick={() => setOpenAddGroup(true)}
                    variant="default"
                    size="icon"
                    className="mb-6"
                  >
                    <SquarePlus />
                  </Button>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="membershipId"
              render={({ field }) => (
                <div className="flex items-end gap-2 w-full">
                  <FormItem className="flex-1">
                    <FormLabel>Membership</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select membership" />
                        </SelectTrigger>
                        <SelectContent>
                          {memberships.map((membership) => (
                            <SelectItem
                              key={membership.id}
                              value={String(membership.id)}
                            >
                              {membership.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.membershipId?.message}
                    </FormDescription>
                  </FormItem>
                  <Button
                    type="button"
                    onClick={() => setOpenAddMembership(true)}
                    variant="default"
                    size="icon"
                    className="mb-6"
                  >
                    <SquarePlus />
                  </Button>
                </div>
              )}
            />

            <Button type="submit" loading={loading} className="mb-6">
              Create Customer
            </Button>
          </form>
        </Form>

        <AddGroupModal open={openAddGroup} onOpenChange={setOpenAddGroup} />
        <AddMembershipModal
          open={openAddMembership}
          onOpenChange={setOpenAddMembership}
        />
      </DialogContent>
    </Dialog>
  );
};
