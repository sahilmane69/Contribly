import Image from "next/image";
import Link from "next/link";

import { auth } from "../../auth";
import { UserAccountMenu } from "@/components/billing/user-account-menu";
import { normalizePlan } from "@/lib/billing";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "/pricing" },
];

export async function LandingNavbar() {
  const session = await auth();
  const avatar = session?.user?.avatar ?? session?.user?.image;
  const plan = normalizePlan(session?.user?.plan);

  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="flex w-full max-w-3xl items-center gap-1 rounded-full border-[3px] border-black bg-black p-1 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:w-auto">
          <Link
            href="#"
            className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-black"
            aria-label="Contribly home"
          >
            <Image
              src="/assets/contribly-logo.png"
              alt="Contribly logo"
              width={36}
              height={36}
              priority
              className="size-7 object-contain"
            />
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-none">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="simple-nav-link">
                <span>{item.label}</span>
              </Link>
            ))}
            {session?.user ? (
              <UserAccountMenu
                avatar={avatar}
                name={session.user.name}
                plan={plan}
                username={session.user.username}
              />
            ) : (
              <Link href="/sign-in/github" className="simple-nav-link">
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
