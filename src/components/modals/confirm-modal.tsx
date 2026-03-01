import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  confirmable,
  ConfirmDialogProps,
  createConfirmation,
} from "react-confirm";

interface Props {
  confirmation: string;
}

const ConfirmModal: React.FC<ConfirmDialogProps<Props, boolean>> = ({
  show,
  proceed,
  confirmation,
}) => {
  return (
    <AlertDialog open={show}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alert!</AlertDialogTitle>
          <AlertDialogDescription>{confirmation}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => proceed(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => proceed(true)}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ConfirmableModal = confirmable(ConfirmModal);

export const confirm = createConfirmation(ConfirmableModal);

export const confirmation = (confirmation: string) => confirm({ confirmation });
