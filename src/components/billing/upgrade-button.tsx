import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PlanBadge } from "@/components/billing/plan-badge";
import type { PlanRole } from "@/lib/billing";
import { cn } from "@/lib/utils";

export function UpgradeButton({
  className,
  plan,
}: {
  className?: string;
  plan: PlanRole;
}) {
  if (plan === "pro" || plan === "team") {
    return <PlanBadge plan={plan} className={className} />;
  }

  return (
    <Link
      href="/pricing"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white bg-white px-4 text-sm font-semibold text-black transition duration-200 hover:bg-white/88",
        className,
      )}
    >
      Upgrade
      <ArrowUpRight className="size-4" />
    </Link>
  );
}
