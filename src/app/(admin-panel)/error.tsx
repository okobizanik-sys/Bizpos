"use client";

import { Button } from "@/components/ui/button";
import { FileWarningIcon, TreesIcon } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
  }, [error]);

  return (
    <div className="flex min-h-[600px] items-center justify-center px-4">
      <div className="flex w-full max-w-[700px] flex-col items-center justify-center text-center">
        <FileWarningIcon size={68} />
        <h1 className="">{error.name}</h1>
        <span className="italic text-slate-700">{error.message}</span>
        <h2>Something went wrong!</h2>
        <Button
          onClick={
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
