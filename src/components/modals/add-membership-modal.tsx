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
import { createMembershipAction } from "./actions";
import { SubmitButton } from "../ui/submit-button";
import { useFormState } from "react-dom";

type AddMembershipModalProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export const AddMembershipModal: React.FC<AddMembershipModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [state, formAction] = useFormState(createMembershipAction, {
    status: false,
    error: null,
  });

  const form = useForm({
    defaultValues: {
      type: "",
      description: "",
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
            <DialogTitle>Add New Membership</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Membership Type <b>*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter membership type" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {state.error?.type?.join(",")}
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
