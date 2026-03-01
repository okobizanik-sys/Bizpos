import { Card, CardContent } from "@/components/ui/card";
import { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
  return (
    <Card className="rounded-lg border-none w-full">
      <CardContent className="w-full p-6">
        <div className="min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
