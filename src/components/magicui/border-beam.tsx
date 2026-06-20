import * as React from "react";

import { cn } from "@/lib/utils";

export function BorderBeam({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] p-px",
        "before:absolute before:size-24 before:rounded-full before:bg-[linear-gradient(90deg,transparent,#2cf2ff,#8b5cf6,transparent)] before:[animation:border-beam_6s_linear_infinite] before:[offset-anchor:50%_50%] before:[offset-path:rect(0_auto_auto_0_round_16px)]",
        className,
      )}
    />
  );
}
