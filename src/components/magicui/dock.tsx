import * as React from "react";

import { cn } from "@/lib/utils";

export function Dock({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-1 rounded-lg border bg-card/80 p-1.5 shadow-2xl backdrop-blur-xl md:flex",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DockIcon({
  children,
  className,
  label,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
