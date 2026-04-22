"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/store/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/store/use-sidebar-toggle";
import { useBranch } from "@/hooks/store/use-branch";
import BranchSelector from "../branch-selector/branch-selector";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const branch = useStore(useBranch, (state) => state.branch);

  if (!sidebar) return null;
  if (typeof branch === "undefined") {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  if (branch?.id === 0) return <BranchSelector />; // Show Branch Selector if no branch is set

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-100 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64"
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64"
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
