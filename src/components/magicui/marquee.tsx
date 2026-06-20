import * as React from "react";

import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("group flex overflow-hidden [--gap:1rem]", className)}>
      <div className="flex min-w-full shrink-0 items-center gap-[var(--gap)] [animation:marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="flex min-w-full shrink-0 items-center gap-[var(--gap)] [animation:marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]"
      >
        {children}
      </div>
    </div>
  );
}
