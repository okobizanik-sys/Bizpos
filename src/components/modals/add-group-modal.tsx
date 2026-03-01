"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction, useEffect } from "react";
import { createGroupAction } from "./actions";
import { SubmitButton } from "../ui/submit-button";
import { useFormState } from "react-dom";

type AddGroupModalProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export const AddGroupModal: React.FC<AddGroupModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [state, formAction] = useFormState(createGroupAction, {
    status: false,
    error: null,
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (state.status) {
      form.reset();
      onOpenChange(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Group Name <b>*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {state.error?.name?.join(",")}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </Form>
          </div>
          <DialogFooter>
            <SubmitButton>Create</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
