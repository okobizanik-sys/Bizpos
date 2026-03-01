"use client";

import { AddSizeModal } from "@/components/modals/add-size-modal";
import { SizesTable } from "@/components/tables/sizes-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sizes } from "@/types/shared";
import { PlusIcon } from "lucide-react";
import React from "react";

interface Props {
  data: Sizes[];
}

export const CardSize: React.FC<Props> = ({ data }) => {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <>
      <Card className="container rounded-lg border-none">
        <div className="flex justify-between py-4 items-center">
          <span className="font-bold">Levels / Sizes</span>
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
          <SizesTable data={data} />
        </CardContent>
      </Card>
      <AddSizeModal open={openModal} onOpenChange={setOpenModal} />
    </>
  );
};
