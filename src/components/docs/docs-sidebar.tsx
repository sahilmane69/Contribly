import Link from "next/link";

import { DocsSearch } from "@/components/docs/docs-search";
import { docsNavigation } from "@/lib/docs/content";
import { cn } from "@/lib/utils";

export function DocsSidebar({ currentSlug }: { currentSlug: string }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r bg-background/90 px-4 py-5 backdrop-blur lg:block">
      <Link href="/docs" className="text-sm font-semibold">
        Contribly Docs
      </Link>
      <div className="mt-5">
        <DocsSearch />
      </div>
      <nav className="mt-6 space-y-6">
        {docsNavigation.map((group) => (
          <div key={group.title}>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <group.icon className="size-3.5" />
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                    currentSlug === item.slug && "bg-secondary text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function MobileDocsNav({ currentSlug }: { currentSlug: string }) {
  return (
    <details className="rounded-lg border bg-card p-3 lg:hidden">
      <summary className="cursor-pointer list-none text-sm font-medium">
        Browse documentation
      </summary>
      <div className="mt-4">
        <DocsSearch />
      </div>
      <nav className="mt-4 grid gap-4">
        {docsNavigation.map((group) => (
          <div key={group.title}>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              {group.title}
            </p>
            <div className="grid gap-1">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-sm text-muted-foreground",
                    currentSlug === item.slug && "bg-secondary text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </details>
  );
}
