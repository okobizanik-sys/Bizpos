"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/store/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/store/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { getSetting } from "@/services/settings";
import { Settings } from "@/types/shared";
import React from "react";
import { fileUrlGenerator } from "@/utils/helpers";
// import logo from "@/assets/images/Bizpos-LOGO-3-2K.png";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const [setting, setSetting] = React.useState<Settings>();
  const [logoLoadFailed, setLogoLoadFailed] = React.useState(false);

  React.useEffect(() => {
    getSetting().then((data) => setSetting(data));
  }, []);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;
  const logoSrc = setting?.logo_image_url
    ? fileUrlGenerator(setting.logo_image_url)
    : "";

  React.useEffect(() => {
    setLogoLoadFailed(false);
  }, [logoSrc]);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-64"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                "font-bold uppercase text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 w-[150px] h-[40px]",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              {logoSrc && !logoLoadFailed ? (
                <img
                  src={logoSrc}
                  alt={String(brandName)}
                  height={40}
                  width={150}
                  className="w-full h-full object-contain"
                  onError={() => setLogoLoadFailed(true)}
                />
              ) : (
                <p className="h-full w-full truncate text-base font-bold uppercase leading-10">
                  {brandName || "BIZPOS"}
                </p>
              )}
            </span>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
