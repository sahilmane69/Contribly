import * as React from "react";

import { cn } from "@/lib/utils";

export function AnimatedGradientText({
  children,
  className,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "bg-[linear-gradient(110deg,#f7f9ff,45%,#2cf2ff,55%,#8b5cf6,65%,#f7f9ff)] bg-[length:260%_100%] bg-clip-text text-transparent [animation:shimmer_5s_linear_infinite]",
        className,
      )}
    >
      {children}
    </span>
  );
}
