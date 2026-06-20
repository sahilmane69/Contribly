import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bookmark,
  BookmarkCheck,
  CircleDot,
  ExternalLink,
  Filter,
  GitFork,
  Search,
  Star,
} from "lucide-react";

import {
  favoriteRepositoryAction,
  followRepositoryAction,
  unfollowRepositoryAction,
} from "@/app/actions/repositories";
import { auth } from "../../../auth";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  curatedRepositories,
  repositoryCategories,
  repositoryDifficulties,
  repositoryLanguages,
} from "@/lib/repositories/curated";
import { cn } from "@/lib/utils";
import { getRepositoryFollows } from "@/lib/supabase-admin";

type RepositorySearchParams = {
  q?: string;
  category?: string;
  language?: string;
  difficulty?: string;
};

function formatCompact(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function RepositoryExplorerPage({
  searchParams,
}: {
  searchParams: Promise<RepositorySearchParams>;
}) {
  const session = await auth();

  if (!session?.user?.githubId) {
    redirect("/");
  }

  const params = await searchParams;
  const query = getSearchParam(params.q).trim();
  const category = getSearchParam(params.category);
  const language = getSearchParam(params.language);
  const difficulty = getSearchParam(params.difficulty);

  const follows = await getRepositoryFollows(session.user.githubId);
  const followMap = new Map(
    follows.map((follow) => [
      follow.repository_id,
      { isFavorite: Boolean(follow.is_favorite) },
    ]),
  );

  const filteredRepositories = curatedRepositories
    .filter((repo) => {
      const matchesQuery = query
        ? [repo.name, repo.owner, repo.fullName, repo.description, repo.language]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        : true;
      const matchesCategory = category ? repo.category === category : true;
      const matchesLanguage = language ? repo.language === language : true;
      const matchesDifficulty = difficulty
        ? repo.difficulty === difficulty
        : true;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesLanguage &&
        matchesDifficulty
      );
    })
    .sort((a, b) => {
      const aFollow = followMap.has(a.id) ? 1 : 0;
      const bFollow = followMap.has(b.id) ? 1 : 0;
      const aFavorite = followMap.get(a.id)?.isFavorite ? 1 : 0;
      const bFavorite = followMap.get(b.id)?.isFavorite ? 1 : 0;

      return bFavorite - aFavorite || bFollow - aFollow || b.stars - a.stars;
    });

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitFork className="size-4" />
              Repository Explorer
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-5xl">
              Find projects worth your next pull request.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Browse curated open-source repositories by language, category,
              difficulty, and contribution signal.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>

        <form
          action="/repositories"
          className="grid gap-3 rounded-lg border bg-card/72 p-3 backdrop-blur-xl md:grid-cols-[1.3fr_1fr_1fr_1fr_auto_auto]"
        >
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search repos, owners, languages..."
              className="pl-9"
            />
          </label>

          <FilterSelect name="category" defaultValue={category}>
            <option value="">All categories</option>
            {repositoryCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect name="language" defaultValue={language}>
            <option value="">All languages</option>
            {repositoryLanguages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect name="difficulty" defaultValue={difficulty}>
            <option value="">Any difficulty</option>
            {repositoryDifficulties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>

          <Button type="submit">
            <Filter className="size-4" />
            Apply
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/repositories">Reset</Link>
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{filteredRepositories.length} matches</Badge>
          <Badge variant="outline">{follows.length} followed</Badge>
          <Badge variant="outline">
            {follows.filter((follow) => follow.is_favorite).length} saved
          </Badge>
        </div>

        <BentoGrid>
          {filteredRepositories.map((repo, index) => {
            const follow = followMap.get(repo.id);
            const isFollowed = Boolean(follow);
            const isFavorite = Boolean(follow?.isFavorite);

            return (
              <BentoCard
                key={repo.id}
                className={cn(
                  "group flex min-h-[300px] flex-col justify-between transition duration-300 hover:-translate-y-1 hover:border-foreground/30",
                  index === 0 || index === 3 ? "lg:col-span-3" : "lg:col-span-2",
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-12 shrink-0 place-items-center rounded-md border bg-background text-lg font-semibold">
                        {repo.logo}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-muted-foreground">
                          {repo.owner}
                        </p>
                        <h2 className="truncate text-xl font-semibold tracking-normal">
                          {repo.name}
                        </h2>
                      </div>
                    </div>
                    {isFavorite ? (
                      <BookmarkCheck className="size-5 shrink-0 text-foreground" />
                    ) : (
                      <Bookmark className="size-5 shrink-0 text-muted-foreground" />
                    )}
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {repo.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="outline">{repo.category}</Badge>
                    <Badge>{repo.difficulty}</Badge>
                    <Badge variant="secondary">
                      <CircleDot className="mr-1 size-3" />
                      {repo.language}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric icon={<Star className="size-4" />} label="Stars">
                      {formatCompact(repo.stars)}
                    </Metric>
                    <Metric icon={<GitFork className="size-4" />} label="Open issues">
                      {formatCompact(repo.openIssues)}
                    </Metric>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {isFollowed ? (
                      <form action={unfollowRepositoryAction}>
                        <input type="hidden" name="repositoryId" value={repo.id} />
                        <Button type="submit" variant="outline" size="sm">
                          Unfollow
                        </Button>
                      </form>
                    ) : (
                      <form action={followRepositoryAction}>
                        <input type="hidden" name="repositoryId" value={repo.id} />
                        <Button type="submit" size="sm">
                          Follow
                        </Button>
                      </form>
                    )}

                    <form action={favoriteRepositoryAction}>
                      <input type="hidden" name="repositoryId" value={repo.id} />
                      <input
                        type="hidden"
                        name="isFavorite"
                        value={String(!isFavorite)}
                      />
                      <Button type="submit" variant="outline" size="sm">
                        {isFavorite ? "Saved" : "Save"}
                      </Button>
                    </form>

                    <Button asChild size="sm" variant="ghost">
                      <a href={repo.url} target="_blank" rel="noreferrer">
                        GitHub
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </BentoGrid>
      </div>
    </main>
  );
}

function FilterSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-foreground/50",
        className,
      )}
      {...props}
    />
  );
}

function Metric({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-md border bg-background/50 p-3">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-mono text-lg font-semibold">{children}</p>
    </div>
  );
}
