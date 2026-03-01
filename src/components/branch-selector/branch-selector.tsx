"use client";

import React, { useState, useEffect } from "react";
import { getAllBranches } from "./action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building } from "lucide-react";
import { getBranch } from "./action";
import { useStore } from "@/hooks/store/use-store";
import { useBranch } from "@/hooks/store/use-branch";
import { useRouter } from "next/navigation";
import { Branches } from "@/types/shared";

export default function BranchSelector() {
  const [branches, setBranches] = useState<Branches[]>([]);
  const [loading, setLoading] = useState(false);

  const branchStore = useStore(useBranch, (state) => state);
  const router = useRouter();

  useEffect(() => {
    getAllBranches().then((branches) => setBranches(branches));
  }, []);

  const handleBranchSelect = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const branchId = formData.get("branch") as string;

    const branch = await getBranch(Number(branchId));
    branchStore?.setBranch(branch);
    // console.log(branch, "selected branch form branch selector");
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="min-h-[300px] w-96 p-4">
        <CardTitle className="text-center py-2">Select Branch</CardTitle>
        <form onSubmit={handleBranchSelect}>
          <CardContent>
            <ScrollArea className="h-[240px] py-4">
              <div className="flex flex-col gap-2">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="border-2 rounded-lg flex gap-2 hover:bg-gray-800 hover:text-gray-50"
                  >
                    <Input
                      type="radio"
                      id={String(branch.id)}
                      name="branch"
                      value={branch.id}
                      className="peer hidden"
                    />
                    <label
                      className="peer-checked:text-primary flex gap-2 w-full p-4"
                      htmlFor={String(branch.id)}
                    >
                      <Building className="peer-checked:text-primary" />
                      <span>{branch.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="default" loading={loading}>
              Select
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
