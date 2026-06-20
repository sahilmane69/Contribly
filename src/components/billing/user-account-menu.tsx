import Image from "next/image";
import Link from "next/link";

import { signOutUser } from "@/app/actions/auth";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import type { PlanRole } from "@/lib/billing";

export function UserAccountMenu({
  avatar,
  name,
  plan,
  username,
}: {
  avatar?: string | null;
  name?: string | null;
  plan: PlanRole;
  username?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <UpgradeButton plan={plan} />
      <details className="group relative shrink-0">
        <summary className="flex size-10 cursor-pointer list-none items-center justify-center overflow-hidden rounded-full border border-white/15 bg-secondary text-foreground transition hover:opacity-85 [&::-webkit-details-marker]:hidden">
          {avatar ? (
            <Image
              src={avatar}
              alt={name ?? "GitHub avatar"}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">
              {(name ?? username ?? "U").slice(0, 1)}
            </span>
          )}
        </summary>
        <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-white/10 bg-black p-2 text-sm shadow-2xl">
          <div className="px-3 py-2">
            <p className="truncate font-medium text-white">{name ?? username}</p>
            <p className="truncate text-xs text-white/55">
              @{username ?? "github-user"}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-white/80 transition hover:bg-white hover:text-black"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="block rounded-md px-3 py-2 text-white/80 transition hover:bg-white hover:text-black"
          >
            Billing
          </Link>
          <form action={signOutUser}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-white/80 transition hover:bg-white hover:text-black"
            >
              Sign out
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
