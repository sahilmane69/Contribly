import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Brain,
  Clock,
  Gauge,
  GitPullRequestArrow,
  Sparkles,
} from "lucide-react";

import { auth } from "../../../auth";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createIssueRecommendations,
  fetchOpenIssuesForRepositories,
  type StoredSkillProfile,
} from "@/lib/issue-recommendations";
import { curatedRepositories } from "@/lib/repositories/curated";
import { getRepositoryFollows, getSkillProfile } from "@/lib/supabase-admin";
import { cn } from "@/lib/utils";

export default async function RecommendationsPage() {
  const session = await auth();

  if (!session?.user?.githubId || !session.githubAccessToken) {
    redirect("/");
  }

  const [profile, follows] = await Promise.all([
    getSkillProfile(session.user.githubId),
    getRepositoryFollows(session.user.githubId),
  ]);

  if (!profile) {
    return (
      <EmptyState
        title="Create your skill profile first"
        description="Contribly needs your AI skill profile before it can recommend issues that fit your strengths."
        actionHref="/onboarding"
        actionLabel="Start onboarding"
      />
    );
  }

  const followedRepositoryIds = new Set(
    follows.map((follow) => follow.repository_id),
  );
  const followedRepositories = curatedRepositories.filter((repo) =>
    followedRepositoryIds.has(repo.id),
  );

  if (!followedRepositories.length) {
    return (
      <EmptyState
        title="Follow a few repositories"
        description="Issue recommendations are based on the repositories you follow, plus your AI skill profile."
        actionHref="/repositories"
        actionLabel="Explore repositories"
      />
    );
  }

  const issues = await fetchOpenIssuesForRepositories({
    accessToken: session.githubAccessToken,
    repositories: followedRepositories,
  });

  const recommendations = await createIssueRecommendations({
    profile: {
      skills: (profile.skills ?? []) as StoredSkillProfile["skills"],
      expertise_score: profile.expertise_score,
      technologies: (profile.technologies ?? []) as string[],
      interest_categories: (profile.interest_categories ?? []) as string[],
      summary: profile.summary,
    },
    repositories: followedRepositories,
    issues,
  });

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              AI Issue Recommendations
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-5xl">
              Issues that match your current edge.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              OpenAI compares your profile, followed repositories, and live open
              issues to surface the best contribution opportunities.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/repositories">Manage repos</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{followedRepositories.length} followed repos</Badge>
          <Badge variant="outline">{issues.length} open issues scanned</Badge>
          <Badge variant="outline">{recommendations.length} AI matches</Badge>
        </div>

        {recommendations.length ? (
          <BentoGrid>
            {recommendations.map((recommendation, index) => (
              <BentoCard
                key={`${recommendation.repositoryId}-${recommendation.issueId}`}
                className={cn(
                  "flex min-h-[320px] flex-col justify-between transition duration-300 hover:-translate-y-1 hover:border-foreground/30",
                  index === 0 ? "lg:col-span-3" : "lg:col-span-2",
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="bg-foreground text-background">
                        {recommendation.matchScore}% Match
                      </Badge>
                      <p className="mt-4 text-sm text-muted-foreground">
                        {recommendation.repository}
                      </p>
                      <h2 className="mt-2 line-clamp-2 text-2xl font-semibold tracking-normal">
                        {recommendation.title}
                      </h2>
                    </div>
                    <Brain className="size-6 shrink-0 text-muted-foreground" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="outline">
                      <Gauge className="mr-1 size-3" />
                      {recommendation.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      <Clock className="mr-1 size-3" />
                      {recommendation.estimatedCompletionTime}
                    </Badge>
                  </div>

                  <div className="mt-5 rounded-md border bg-background/50 p-4">
                    <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <GitPullRequestArrow className="size-4" />
                      AI reasoning
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {recommendation.whyItMatches}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {recommendation.technologies.map((technology) => (
                      <Badge key={technology} variant="outline">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button asChild className="mt-6 w-fit">
                  <a href={recommendation.url} target="_blank" rel="noreferrer">
                    View issue
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </BentoCard>
            ))}
          </BentoGrid>
        ) : (
          <EmptyPanel />
        )}
      </div>
    </main>
  );
}

function EmptyState({
  actionHref,
  actionLabel,
  description,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  description: string;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-background px-4 py-24 text-foreground">
      <div className="mx-auto max-w-2xl rounded-lg border bg-card/72 p-6 backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">AI Issue Recommendations</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
    </main>
  );
}

function EmptyPanel() {
  return (
    <div className="rounded-lg border bg-card/72 p-6 text-sm text-muted-foreground backdrop-blur-xl">
      No open issues were available from your followed repositories right now.
      Try following more repositories or checking again later.
    </div>
  );
}
