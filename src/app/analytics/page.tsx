import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  Flame,
  GitMerge,
  GitPullRequestArrow,
  Layers3,
  Radar,
  Sparkles,
} from "lucide-react";

import { auth } from "../../../auth";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createContributionAnalytics,
  type ContributionAnalytics,
} from "@/lib/contribution-analytics";
import { getSkillProfile } from "@/lib/supabase-admin";
import { cn } from "@/lib/utils";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.githubId) {
    redirect("/");
  }

  const profile = await getSkillProfile(session.user.githubId);

  if (!profile) {
    return (
      <main className="min-h-screen bg-background px-4 py-24 text-foreground">
        <div className="mx-auto max-w-2xl rounded-lg border bg-card/72 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">Contribution Analytics</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            Your analytics are waiting for data.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Run onboarding first so Contribly can store your GitHub activity in
            Supabase and turn it into contribution analytics.
          </p>
          <Button asChild className="mt-6">
            <Link href="/onboarding">Start onboarding</Link>
          </Button>
        </div>
      </main>
    );
  }

  const analytics = createContributionAnalytics(profile);

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Radar className="size-4" />
              Contribution Analytics
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-5xl">
              Your open-source operating picture.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              A Supabase-backed view of solved issues, pull requests, streaks,
              technologies, and repository momentum.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/recommendations">AI issue matches</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>

        <BentoGrid>
          <MetricCard
            icon={<Activity className="size-5" />}
            label="Issues solved"
            value={analytics.issuesSolved}
            detail="Closed issue events from Supabase"
          />
          <MetricCard
            icon={<GitPullRequestArrow className="size-5" />}
            label="PRs opened"
            value={analytics.pullRequestsOpened}
            detail="Recent public pull requests"
          />
          <MetricCard
            icon={<GitMerge className="size-5" />}
            label="PRs merged"
            value={analytics.pullRequestsMerged}
            detail="Merged contribution signal"
          />
          <MetricCard
            icon={<Flame className="size-5" />}
            label="Current streak"
            value={analytics.currentStreak}
            detail="Days with stored activity"
            suffix="d"
          />

          <BentoCard className="lg:col-span-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Activity funnel</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  Contribution flow
                </h2>
              </div>
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-8 grid h-64 grid-cols-4 items-end gap-4">
              {analytics.activityTrend.map((item, index) => (
                <div key={item.label} className="flex h-full flex-col justify-end">
                  <div
                    className="analytics-bar rounded-t-md border border-white/10 bg-foreground/90"
                    style={
                      {
                        "--analytics-height": `${item.percentage}%`,
                        "--analytics-delay": `${index * 90}ms`,
                      } as CSSProperties
                    }
                  />
                  <div className="mt-3">
                    <p className="font-mono text-lg font-semibold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Top technologies</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  Language mix
                </h2>
              </div>
              <Layers3 className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-6 flex flex-col gap-4">
              {analytics.topTechnologies.length ? (
                analytics.topTechnologies.map((technology, index) => (
                  <HorizontalBar
                    key={technology.name}
                    label={technology.name}
                    value={formatLanguageValue(technology.value)}
                    percentage={technology.percentage}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  No language data has been stored yet.
                </p>
              )}
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Repository activity</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  Where your contribution energy is going
                </h2>
              </div>
              <Badge variant="outline">
                {analytics.repositoryActivity.length} active repositories
              </Badge>
            </div>

            <div className="mt-6 grid gap-3">
              {analytics.repositoryActivity.length ? (
                analytics.repositoryActivity.map((repo, index) => (
                  <RepositoryRow key={repo.name} repo={repo} index={index} />
                ))
              ) : (
                <p className="rounded-md border bg-background/50 p-4 text-sm text-muted-foreground">
                  Repository activity will appear after onboarding stores your
                  GitHub events in Supabase.
                </p>
              )}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </main>
  );
}

function MetricCard({
  detail,
  icon,
  label,
  suffix,
  value,
}: {
  detail: string;
  icon: ReactNode;
  label: string;
  suffix?: string;
  value: number;
}) {
  return (
    <BentoCard className="lg:col-span-1">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="rounded-md border bg-background/60 p-2 text-muted-foreground">
          {icon}
        </span>
      </div>
      <div className="mt-5 flex items-end gap-1">
        <span className="font-mono text-5xl font-semibold">
          <NumberTicker value={value} />
        </span>
        {suffix ? <span className="pb-2 text-muted-foreground">{suffix}</span> : null}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">{detail}</p>
    </BentoCard>
  );
}

function HorizontalBar({
  index,
  label,
  percentage,
  value,
}: {
  index: number;
  label: string;
  percentage: number;
  value: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">{value}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="analytics-line h-full rounded-full bg-foreground"
          style={
            {
              "--analytics-width": `${percentage}%`,
              "--analytics-delay": `${index * 80}ms`,
            } as CSSProperties
          }
        />
      </div>
    </div>
  );
}

function RepositoryRow({
  index,
  repo,
}: {
  index: number;
  repo: ContributionAnalytics["repositoryActivity"][number];
}) {
  return (
    <div className="grid gap-4 rounded-md border bg-background/50 p-4 md:grid-cols-[1.3fr_1fr_auto] md:items-center">
      <div className="min-w-0">
        <p className="truncate font-medium">{repo.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {repo.events} events · {repo.pullRequests} pull requests ·{" "}
          {repo.stars.toLocaleString()} stars
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("analytics-line h-full rounded-full bg-foreground")}
          style={
            {
              "--analytics-width": `${repo.percentage}%`,
              "--analytics-delay": `${index * 70}ms`,
            } as CSSProperties
          }
        />
      </div>
      <Button asChild size="sm" variant="ghost">
        <a href={`https://github.com/${repo.name}`} target="_blank" rel="noreferrer">
          View
          <ArrowUpRight className="size-4" />
        </a>
      </Button>
    </div>
  );
}

function formatLanguageValue(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
