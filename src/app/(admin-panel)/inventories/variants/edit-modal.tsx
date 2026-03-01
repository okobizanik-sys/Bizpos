"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { VariantType } from "./page";
import { deleteFormAction, updateFromAction } from "./actions";
import { useFormState } from "react-dom";
import React from "react";
import { Button } from "@/components/ui/button";
import { confirmation } from "@/components/modals/confirm-modal";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  open: boolean;
  id: string;
  name: string;
  type: VariantType;
}

export const EditModal: React.FC<Props> = ({ open, id, type, name }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = React.useState(open);
  const [deleting, setDeleting] = React.useState(false);
  const [formState, formAction] = useFormState(updateFromAction, false);

  React.useEffect(() => {
    if (!modalOpen) router.replace("/inventories/variants");
  }, [modalOpen]);

  React.useEffect(() => {
    if (formState) {
      setModalOpen(false);
      router.replace("/inventories/variants");
    }
  }, [formState]);

  const form = useForm({
    defaultValues: {
      name: name,
    },
  });

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this product?")) {
      setDeleting(true);
      try {
        const deleted = await deleteFormAction(type, Number(id));

        if (deleted) {
          toast({
            title: "Deleted successfully",
            description: `The item has been deleted successfully`,
            variant: "default",
          });
          setModalOpen(false);
          router.replace("/inventories/variants");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    setDeleting(false);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogHeader>
        <DialogTitle>Update</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="type" value={type} />
          <div className="mt-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <b>*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4"></FormDescription>
                  </FormItem>
                )}
              />
            </Form>
          </div>
          <DialogFooter>
            <SubmitButton>Update</SubmitButton>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClick}
              loading={deleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
