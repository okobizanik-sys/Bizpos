"use client";

import { AddColorModal } from "@/components/modals/add-color-modal";
import { ColorsTable } from "@/components/tables/colors-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Colors } from "@/types/shared";
import { PlusIcon } from "lucide-react";
import React from "react";

interface Props {
  data: Colors[];
}

export const CardColor: React.FC<Props> = ({ data }) => {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <>
      <Card className="container rounded-lg border-none">
        <div className="flex justify-between py-4 items-center">
          <span className="font-bold">Colors</span>
          <Button
            size="sm"
            className="flex gap-1 items-center"
            onClick={() => setOpenModal(true)}
          >
            <PlusIcon size={16} />
            <span>Create</span>
          </Button>
        </div>
        <CardContent>
          <ColorsTable data={data} />
        </CardContent>
      </Card>
      <AddColorModal open={openModal} onOpenChange={setOpenModal} />
    </>
  );
};
