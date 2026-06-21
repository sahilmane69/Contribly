import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsRenderer, DocsToc } from "@/components/docs/docs-renderer";
import { DocsSidebar, MobileDocsNav } from "@/components/docs/docs-sidebar";
import { docsPages, getDocsPage } from "@/lib/docs/content";

type DocsPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return docsPages.map((page) => ({
    slug: page.slug ? page.slug.split("/") : undefined,
  }));
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.join("/") ?? "";
  const page = getDocsPage(slug);

  if (!page) {
    return {
      title: "Docs | Contribly",
    };
  }

  return {
    title: `${page.title} | Contribly Docs`,
    description: page.description,
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.join("/") ?? "";
  const page = getDocsPage(slug);

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <DocsSidebar currentSlug={slug} />
        <div className="min-w-0 flex-1">
          <div className="border-b px-4 py-4 lg:hidden">
            <MobileDocsNav currentSlug={slug} />
          </div>
          <div className="flex">
            <DocsRenderer page={page} />
            <DocsToc page={page} />
          </div>
        </div>
      </div>
    </main>
  );
}
