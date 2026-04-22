"use client";
import React, { useState, useEffect } from "react";
import { getAllBranches } from "./action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building } from "lucide-react";
import { getBranch } from "./action";
import { useBranch } from "@/hooks/store/use-branch";
import { usePathname, useRouter } from "next/navigation";
import { Branches } from "@/types/shared";
import { useToast } from "@/components/ui/use-toast";

export default function BranchSelector() {
  const [branches, setBranches] = useState<Branches[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const setBranch = useBranch((state) => state.setBranch);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    getAllBranches()
      .then((branches) => {
        if (!active) return;
        setBranches(branches);
      })
      .catch((error) => {
        if (!active) return;
        toast({
          title: "Failed to load branches",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        if (active) {
          setLoadingBranches(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleBranchSelect = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!selectedBranchId) return;

    setLoading(true);
    try {
      const branch = await getBranch(Number(selectedBranchId));
      setBranch(branch);
      router.push(pathname || "/dashboard");
      router.refresh();
    } catch (error) {
      toast({
        title: "Branch selection failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="min-h-[300px] w-96 p-4">
        <CardTitle className="text-center py-2">Select Branch</CardTitle>
        <form onSubmit={handleBranchSelect}>
          <CardContent>
            <ScrollArea className="h-[240px] py-4">
              <div className="flex flex-col gap-2">
                {loadingBranches && (
                  <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                    Loading branches...
                  </p>
                )}
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
                      checked={selectedBranchId === String(branch.id)}
                      onChange={(event) => setSelectedBranchId(event.target.value)}
                      className="peer hidden"
                    />
                    <label
                      className="peer-checked:text-primary flex gap-2 w-full cursor-pointer p-4"
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
            <Button
              type="submit"
              variant="default"
              loading={loading}
              disabled={!selectedBranchId || loading || loadingBranches}
            >
              Select
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
