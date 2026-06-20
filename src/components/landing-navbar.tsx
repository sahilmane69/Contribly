"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Sign in", href: "#signin" },
];

type NavLinkElement = HTMLAnchorElement & {
  _leaveTween?: gsap.core.Timeline;
  _driftTween?: gsap.core.Tween;
};

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
              <WateryNavLink key={item.label} href={item.href}>
                {item.label}
              </WateryNavLink>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

function WateryNavLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const linkRef = useRef<NavLinkElement>(null);

  const animateIn = () => {
    const link = linkRef.current;
    if (!link) return;

    link._leaveTween?.kill();
    const blobs = link.querySelectorAll(".water-blob");
    const label = link.querySelector(".water-label");

    gsap.killTweensOf([link, label, blobs]);
    link._driftTween?.kill();

    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .to(link, { y: -2, scaleX: 1.035, scaleY: 0.985, duration: 0.72 }, 0)
      .to(label, { color: "#ffffff", y: -1, duration: 0.48 }, 0.04)
      .to(
        blobs,
        {
          scale: 1,
          opacity: 1,
          x: "random(-6, 6)",
          y: "random(-4, 4)",
          duration: 0.9,
          stagger: 0.07,
          ease: "elastic.out(1, 0.72)",
        },
        0.02,
      );

    link._driftTween = gsap.to(blobs, {
      x: "random(-11, 11)",
      y: "random(-7, 7)",
      scale: "random(0.86, 1.18)",
      duration: 1.85,
      repeat: -1,
      yoyo: true,
      repeatRefresh: true,
      stagger: 0.12,
      ease: "sine.inOut",
    });
  };

  const animateOut = () => {
    const link = linkRef.current;
    if (!link) return;

    const blobs = link.querySelectorAll(".water-blob");
    const label = link.querySelector(".water-label");
    link._leaveTween?.kill();
    link._driftTween?.kill();

    link._leaveTween = gsap
      .timeline({ defaults: { ease: "power4.out" } })
      .to(link, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.95 }, 0.1)
      .to(label, { color: "#000000", y: 0, duration: 0.55 }, 0.18)
      .to(
        blobs,
        {
          scale: 0,
          opacity: 0,
          x: 0,
          y: 0,
          duration: 0.78,
          stagger: 0.055,
          ease: "expo.inOut",
        },
        0.12,
      );
  };

  const animateMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const link = linkRef.current;
    if (!link) return;

    const rect = link.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(link, {
      x: x * 0.028,
      y: -2 + y * 0.018,
      scaleX: 1.035 + Math.abs(x) * 0.00045,
      scaleY: 0.985 + Math.abs(y) * 0.00025,
      duration: 0.85,
      overwrite: "auto",
      ease: "power3.out",
    });
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      className="watery-nav-link"
      onPointerEnter={animateIn}
      onPointerMove={animateMove}
      onPointerLeave={animateOut}
      onFocus={animateIn}
      onBlur={animateOut}
    >
      <span className="water-blob left-[10%] top-[18%] size-4" />
      <span className="water-blob left-[35%] top-[52%] size-8" />
      <span className="water-blob right-[10%] top-[22%] size-5" />
      <span className="water-blob bottom-[8%] right-[28%] size-6" />
      <span className="water-label relative z-10">{children}</span>
    </Link>
  );
}
