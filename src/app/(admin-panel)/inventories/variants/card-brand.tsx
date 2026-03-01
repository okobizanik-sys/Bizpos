"use client";

import { AddBrandModal } from "@/components/modals/add-brand-modal";
import { BrandsTable } from "@/components/tables/brands-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brands } from "@/types/shared";
import { PlusIcon } from "lucide-react";
import React from "react";

interface Props {
  data: Brands[];
}

export const CardBrand: React.FC<Props> = ({ data }) => {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <>
      <Card className="container rounded-lg border-none">
        <div className="flex justify-between py-4 items-center">
          <span className="font-bold">Brands</span>
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
          <BrandsTable data={data} />
        </CardContent>
      </Card>
      <AddBrandModal open={openModal} onOpenChange={setOpenModal} />
    </>
  );
};
