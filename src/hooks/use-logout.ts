"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("selectedBranch");
    try {
      await signOut();
    } catch (error: any) {
      toast({
        title: "Logout Failed!",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return { loading, handleLogout };
};
