"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SubmitButton({ children, className }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" loading={pending} className={cn(className)}>
      {children}
    </Button>
  );
}
