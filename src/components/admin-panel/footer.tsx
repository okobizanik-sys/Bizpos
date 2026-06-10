import Link from "next/link";
import { useEffect, useState } from "react";
import { Settings } from "@/types/shared";
import { fetchSetting } from "@/services/settings-client";

export function Footer() {
  const [setting, setSetting] = useState<Settings>();

  useEffect(() => {
    fetchSetting().then((data) => {
      if (data) {
        setSetting(data);
      }
    });
  }, []);

  return (
    <div className="supports-backdrop-blur:bg-background/60 z-20 w-full shadow bg-background/95 backdrop-blur">
      <div className="mx-4 md:mx-8 flex h-14 items-cente">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/"> {setting?.brand_name} </Link>. All rights reserved.
        </p>
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-right ml-auto">
          Powered by{" "}
          <Link
            href="https://www.okobiz.com"
            target="_blank"
            className="text-blue-700"
          >
            okobiz
          </Link>
        </p>
      </div>
    </div>
  );
}
