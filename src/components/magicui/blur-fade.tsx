import * as React from "react";

import { cn } from "@/lib/utils";

export function BlurFade({
  children,
  className,
  delay = 0,
}: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <div
      className={cn("opacity-0 [animation:blur-fade_700ms_ease_forwards]", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
