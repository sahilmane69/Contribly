import { Crown, Sparkles } from "lucide-react";

import type { PlanRole } from "@/lib/billing";
import { cn } from "@/lib/utils";

export function PlanBadge({
  className,
  plan,
}: {
  className?: string;
  plan: PlanRole;
}) {
  if (plan === "free") return null;

  const label = plan === "team" ? "Team" : "Pro";
  const Icon = plan === "team" ? Crown : Sparkles;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white px-2.5 py-1 text-xs font-semibold text-black shadow-[0_0_32px_rgba(255,255,255,0.22)]",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
