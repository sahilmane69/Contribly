import Image from "next/image";
import Link from "next/link";

import { signInWithGitHub } from "@/app/actions/auth";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-center">
        <div className="flex max-w-full items-center gap-1 rounded-full border-[3px] border-black bg-black p-1 shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
          <Link
            href="#"
            className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-black"
            aria-label="Contribly home"
          >
            <Image
              src="/assets/contribly-logo.png"
              alt="Contribly logo"
              width={36}
              height={36}
              priority
              className="size-8 object-contain"
            />
          </Link>
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="simple-nav-link">
                <span>{item.label}</span>
              </Link>
            ))}
            <form action={signInWithGitHub}>
              <button type="submit" className="simple-nav-link">
                <span>Sign in</span>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}
