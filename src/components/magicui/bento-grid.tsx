import * as React from "react";

import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 lg:grid-cols-6", className)}
      {...props}
    />
  );
}

export function BentoCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card/72 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
