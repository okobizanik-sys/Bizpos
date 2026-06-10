"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/store/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/store/use-sidebar-toggle";
import { useBranch } from "@/hooks/store/use-branch";
import BranchSelector from "../branch-selector/branch-selector";
import { getBranch } from "../branch-selector/action";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const branch = useStore(useBranch, (state) => state.branch);
  const setBranch = useBranch((state) => state.setBranch);
  const { data: session, status } = useSession();
  const [isHydratingBranch, setIsHydratingBranch] = useState(false);

  useEffect(() => {
    const branchId = session?.user?.branchId;

    if (status !== "authenticated") {
      setIsHydratingBranch(false);
      return;
    }

    if (session.user.role === "ADMIN") {
      setIsHydratingBranch(false);
      return;
    }

    if (!branchId) {
      setIsHydratingBranch(false);
      return;
    }

    let active = true;
    setIsHydratingBranch(true);

    getBranch(Number(branchId))
      .then((branchData) => {
        if (!active) return;
        setBranch(branchData);
      })
      .catch(() => {
        if (!active) return;
        setBranch({
          id: Number(branchId),
          name: "",
          address: "",
          phone: "",
          root: false,
        });
      })
      .finally(() => {
        if (active) {
          setIsHydratingBranch(false);
        }
      });

    return () => {
      active = false;
    };
  }, [session, status, setBranch]);

  if (!sidebar) return null;
  if (status === "loading" || isHydratingBranch) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  if (typeof branch === "undefined") {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  if (session?.user?.role === "ADMIN" && branch?.id === 0) {
    return <BranchSelector />;
  }

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-100 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64",
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64",
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
