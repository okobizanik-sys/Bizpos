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
import { MoreHorizontal, SquarePlus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { custom, z } from "zod";
import { deleteCustomerAction, updateFormAction } from "./action";
import { confirmation } from "@/components/modals/confirm-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGroups } from "@/services/group";
import { getMemberships } from "@/services/membership";
import { AddGroupModal } from "@/components/modals/add-group-modal";
import { AddMembershipModal } from "@/components/modals/add-membership-modal";
import { Customers, Groups, Memberships } from "@/types/shared";

interface Props {
  customer: Customers;
}

export const CustomerDetailsSheet: React.FC<Props> = ({ customer }) => {
  const { toast } = useToast();
  const [groups, setGroups] = React.useState<Groups[]>([]);
  const [memberships, setMemberships] = React.useState<Memberships[]>([]);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [openAddGroup, setOpenAddGroup] = React.useState(false);
  const [openAddMembership, setOpenAddMembership] = React.useState(false);

  // Fetch groups and memberships after component mounts
  React.useEffect(() => {
    async function fetchData() {
      try {
        const [groupsData, membershipsData] = await Promise.all([
          getGroups(),
          getMemberships(),
        ]);
        setGroups(groupsData);
        setMemberships(membershipsData);
      } catch (error) {
        // console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  const customerFormSchema = z.object({
    customer: z.string(),
    address: z.string(),
    phone: z.string(),
    groupId: z.string(),
    membershipId: z.string(),
  });

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      customer: customer.customer,
      address: customer.address,
      phone: customer.phone,
      groupId: String(customer.group_id),
      membershipId: String(customer.membership_id),
    },
  });

  const onSubmitUpdate = async (values: z.infer<typeof customerFormSchema>) => {
    setUpdating(true);
    try {
      await updateFormAction(Number(customer.id), values);
      toast({
        title: "Customer updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update customer",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this customer?")) {
      setDeleting(true);
      const deleted = await deleteCustomerAction(Number(customer.id));
      if (deleted) {
        toast({
          title: "Customer deleted successfully",
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
          <SheetTitle>Customer Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitUpdate)}>
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem className="col-span-2">
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
                <FormItem className="col-span-2">
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
                        value={String(field.value)}
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
                        value={String(field.value)}
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

            <div className="absolute bottom-0 right-0 m-4 flex gap-2">
              <Button type="submit" variant="default" loading={updating}>
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                loading={deleting}
                // disabled={customer.root}
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>

      <AddGroupModal open={openAddGroup} onOpenChange={setOpenAddGroup} />
      <AddMembershipModal
        open={openAddMembership}
        onOpenChange={setOpenAddMembership}
      />
    </Sheet>
  );
};
