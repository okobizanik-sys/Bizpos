"use client";

import { AddCategoryModal } from "@/components/modals/add-category-modal";
import { CategoriesTable } from "@/components/tables/categories-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Categories } from "@/types/shared";
import { PlusIcon } from "lucide-react";
import React from "react";

interface Props {
  data: Categories[];
}

export const CardCategory: React.FC<Props> = ({ data }) => {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <>
      <Card className="container rounded-lg border-none">
        <div className="flex justify-between py-4 items-center">
          <span className="font-bold">Categories</span>
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
          <CategoriesTable data={data} />
        </CardContent>
      </Card>
      <AddCategoryModal open={openModal} onOpenChange={setOpenModal} />
    </>
  );
};
