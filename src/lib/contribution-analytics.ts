type StoredRepository = {
  full_name?: string;
  name?: string;
  language?: string | null;
  stargazers_count?: number;
  pushed_at?: string | null;
};

type StoredPullRequest = {
  title?: string;
  repository?: string;
  state?: string;
  merged?: boolean;
  url?: string | null;
};

type StoredContribution = {
  type?: string;
  repository?: string;
  action?: string | null;
  createdAt?: string | null;
};

export type ContributionAnalytics = {
  issuesSolved: number;
  pullRequestsOpened: number;
  pullRequestsMerged: number;
  currentStreak: number;
  topTechnologies: Array<{ name: string; value: number; percentage: number }>;
  repositoryActivity: Array<{
    name: string;
    events: number;
    pullRequests: number;
    stars: number;
    percentage: number;
  }>;
  activityTrend: Array<{ label: string; value: number; percentage: number }>;
};

export function createContributionAnalytics(profile: {
  repositories?: unknown;
  languages?: unknown;
  pull_requests?: unknown;
  contributions?: unknown;
}): ContributionAnalytics {
  const repositories = asArray<StoredRepository>(profile.repositories);
  const pullRequests = asArray<StoredPullRequest>(profile.pull_requests);
  const contributions = asArray<StoredContribution>(profile.contributions);
  const languages = asLanguageMap(profile.languages);

  const issuesSolved = contributions.filter(
    (contribution) =>
      contribution.type === "IssuesEvent" &&
      ["closed", "completed"].includes(contribution.action ?? ""),
  ).length;
  const pullRequestsOpened = pullRequests.length;
  const pullRequestsMerged = pullRequests.filter((pr) => pr.merged).length;

  return {
    issuesSolved,
    pullRequestsOpened,
    pullRequestsMerged,
    currentStreak: calculateCurrentStreak(contributions),
    topTechnologies: createTopTechnologies(languages, repositories),
    repositoryActivity: createRepositoryActivity({
      contributions,
      pullRequests,
      repositories,
    }),
    activityTrend: createActivityTrend(contributions, pullRequests),
  };
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asLanguageMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number>;
  }

  return value as Record<string, number>;
}

function createTopTechnologies(
  languages: Record<string, number>,
  repositories: StoredRepository[],
) {
  const fromLanguages = Object.entries(languages);
  const entries = fromLanguages.length
    ? fromLanguages
    : Object.entries(
        repositories.reduce<Record<string, number>>((acc, repo) => {
          if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
          return acc;
        }, {}),
      );

  const max = Math.max(1, ...entries.map(([, value]) => value));

  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.max(8, Math.round((value / max) * 100)),
    }));
}

function createRepositoryActivity({
  contributions,
  pullRequests,
  repositories,
}: {
  contributions: StoredContribution[];
  pullRequests: StoredPullRequest[];
  repositories: StoredRepository[];
}) {
  const activity = new Map<
    string,
    { events: number; pullRequests: number; stars: number }
  >();

  for (const repo of repositories) {
    const name = repo.full_name ?? repo.name;
    if (!name) continue;
    activity.set(name, {
      events: 0,
      pullRequests: 0,
      stars: repo.stargazers_count ?? 0,
    });
  }

  for (const contribution of contributions) {
    const repository = contribution.repository;
    if (!repository) continue;
    const current = activity.get(repository) ?? {
      events: 0,
      pullRequests: 0,
      stars: 0,
    };
    current.events += 1;
    activity.set(repository, current);
  }

  for (const pr of pullRequests) {
    const repository = pr.repository;
    if (!repository) continue;
    const current = activity.get(repository) ?? {
      events: 0,
      pullRequests: 0,
      stars: 0,
    };
    current.pullRequests += 1;
    activity.set(repository, current);
  }

  const rows = Array.from(activity.entries()).map(([name, value]) => ({
    name,
    ...value,
  }));
  const max = Math.max(
    1,
    ...rows.map((row) => row.events + row.pullRequests * 2),
  );

  return rows
    .sort((a, b) => b.events + b.pullRequests * 2 - (a.events + a.pullRequests * 2))
    .slice(0, 6)
    .map((row) => ({
      ...row,
      percentage: Math.max(
        10,
        Math.round(((row.events + row.pullRequests * 2) / max) * 100),
      ),
    }));
}

function createActivityTrend(
  contributions: StoredContribution[],
  pullRequests: StoredPullRequest[],
) {
  const buckets = [
    { label: "Discover", value: contributions.filter((item) => item.type).length },
    { label: "Discuss", value: contributions.filter((item) => item.type === "IssuesEvent").length },
    { label: "Open PR", value: pullRequests.length },
    { label: "Merge", value: pullRequests.filter((item) => item.merged).length },
  ];
  const max = Math.max(1, ...buckets.map((bucket) => bucket.value));

  return buckets.map((bucket) => ({
    ...bucket,
    percentage: Math.max(8, Math.round((bucket.value / max) * 100)),
  }));
}

function calculateCurrentStreak(contributions: StoredContribution[]) {
  const days = new Set(
    contributions
      .map((contribution) => contribution.createdAt)
      .filter((date): date is string => Boolean(date))
      .map((date) => new Date(date).toISOString().slice(0, 10)),
  );

  if (!days.size) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
