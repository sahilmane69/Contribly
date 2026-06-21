"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { docsPages } from "@/lib/docs/content";

export function DocsSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return docsPages
      .filter((page) =>
        [page.title, page.description, page.category]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search docs..."
        className="h-10 w-full rounded-md border bg-background/70 pl-9 pr-3 text-sm outline-none transition focus:border-white/30"
      />
      {results.length ? (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg border bg-card shadow-2xl">
          {results.map((page) => (
            <Link
              key={page.slug}
              href={`/docs/${page.slug}`}
              className="block border-b px-3 py-3 last:border-b-0 hover:bg-secondary"
              onClick={() => setQuery("")}
            >
              <p className="text-sm font-medium">{page.title}</p>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
