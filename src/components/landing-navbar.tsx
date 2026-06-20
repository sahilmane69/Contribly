import Image from "next/image";
import Link from "next/link";

import { auth } from "../../auth";
import { signOutUser } from "@/app/actions/auth";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
];

export async function LandingNavbar() {
  const session = await auth();
  const avatar = session?.user?.avatar ?? session?.user?.image;

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
              <details className="group relative shrink-0">
                <summary className="flex size-10 cursor-pointer list-none items-center justify-center overflow-hidden rounded-full border-[3px] border-black bg-white text-black transition hover:opacity-85 [&::-webkit-details-marker]:hidden">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={session.user.name ?? "GitHub avatar"}
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-black">
                      {(session.user.name ?? session.user.username ?? "U").slice(0, 1)}
                    </span>
                  )}
                </summary>
                <div className="absolute right-0 top-12 w-48 rounded-lg border border-white/10 bg-black p-2 text-sm shadow-2xl">
                  <div className="px-3 py-2">
                    <p className="truncate font-medium text-white">
                      {session.user.name ?? session.user.username}
                    </p>
                    <p className="truncate text-xs text-white/55">
                      @{session.user.username ?? "github-user"}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block rounded-md px-3 py-2 text-white/80 transition hover:bg-white hover:text-black"
                  >
                    Dashboard
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
