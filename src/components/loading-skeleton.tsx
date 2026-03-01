import React from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const LoadingSkeleton = () => {
  return (
    <Card className="m-4 p-4 pt-12 rounded-lg lg:w-[1200px] lg:h-[1200px]">
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
      <Skeleton className="w-full h-8 mb-2" />
    </Card>
  );
};
