import Link from "next/link";
import { ChevronLeft, ChevronRight, Hash } from "lucide-react";

import { CopyButton } from "@/components/docs/copy-button";
import type { DocsBlock, DocsPage } from "@/lib/docs/content";
import { getDocsNeighbors } from "@/lib/docs/content";

export function DocsRenderer({ page }: { page: DocsPage }) {
  const neighbors = getDocsNeighbors(page.slug);

  return (
    <article className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-12">
      <Breadcrumbs page={page} />
      <header className="max-w-3xl border-b pb-10">
        <p className="text-sm text-muted-foreground">{page.category}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          {page.description}
        </p>
      </header>

      <div className="mt-10 max-w-3xl space-y-12">
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <a
              href={`#${section.id}`}
              className="group flex items-center gap-2 text-2xl font-semibold tracking-normal"
            >
              {section.title}
              <Hash className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </a>
            <div className="mt-5 space-y-5">
              {section.blocks.map((block, index) => (
                <DocsBlockRenderer key={index} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 grid gap-3 border-t pt-8 md:grid-cols-2">
        {neighbors.previous ? (
          <Link
            href={`/docs/${neighbors.previous.slug}`}
            className="rounded-lg border bg-card p-4 transition hover:border-white/25"
          >
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ChevronLeft className="size-4" />
              Previous
            </p>
            <p className="mt-2 font-medium">{neighbors.previous.title}</p>
          </Link>
        ) : <div />}
        {neighbors.next ? (
          <Link
            href={`/docs/${neighbors.next.slug}`}
            className="rounded-lg border bg-card p-4 text-right transition hover:border-white/25"
          >
            <p className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
              Next
              <ChevronRight className="size-4" />
            </p>
            <p className="mt-2 font-medium">{neighbors.next.title}</p>
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function DocsBlockRenderer({ block }: { block: DocsBlock }) {
  if (block.type === "p") {
    return <p className="text-sm leading-7 text-muted-foreground">{block.text}</p>;
  }

  if (block.type === "ul") {
    return (
      <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-3 size-1.5 shrink-0 rounded-full bg-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "steps") {
    return (
      <ol className="space-y-3">
        {block.items.map((item, index) => (
          <li key={item} className="flex gap-4 rounded-md border bg-card p-4">
            <span className="font-mono text-sm text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm leading-6 text-muted-foreground">{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "code") {
    return (
      <div className="overflow-hidden rounded-lg border bg-black">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {block.language}
          </span>
          <CopyButton value={block.value} />
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-6 text-white/85">
          <code>{block.value}</code>
        </pre>
      </div>
    );
  }

  if (block.type === "callout") {
    return (
      <div className="rounded-lg border bg-secondary/50 p-4">
        <p className="font-medium">{block.title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{block.text}</p>
      </div>
    );
  }

  if (block.type === "cards") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {block.cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border bg-card p-4 transition hover:border-white/25"
          >
            <p className="font-medium">{card.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {card.text}
            </p>
          </Link>
        ))}
      </div>
    );
  }

  return null;
}

function Breadcrumbs({ page }: { page: DocsPage }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/docs" className="hover:text-foreground">
        Docs
      </Link>
      {page.slug ? (
        <>
          <span>/</span>
          <span>{page.category}</span>
          <span>/</span>
          <span className="text-foreground">{page.title}</span>
        </>
      ) : null}
    </div>
  );
}

export function DocsToc({ page }: { page: DocsPage }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-l px-5 py-8 xl:block">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        On this page
      </p>
      <div className="mt-3 space-y-1">
        {page.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            {section.title}
          </a>
        ))}
      </div>
    </aside>
  );
}
