type GitHubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  pushed_at: string | null;
};

type GitHubEvent = {
  type: string;
  created_at?: string;
  repo?: { name: string };
  payload?: {
    action?: string;
    pull_request?: {
      title?: string;
      state?: string;
      merged?: boolean;
      html_url?: string;
      base?: { repo?: { full_name?: string } };
    };
  };
};

export type GitHubAnalysisInput = {
  repositories: GitHubRepo[];
  languages: Record<string, number>;
  pullRequests: Array<{
    title: string;
    repository: string;
    state: string;
    merged: boolean;
    url: string | null;
  }>;
  contributions: Array<{
    type: string;
    repository: string;
    action: string | null;
    createdAt: string | null;
  }>;
};

async function githubFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} for ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchGitHubAnalysisInput(
  accessToken: string,
  username: string,
): Promise<GitHubAnalysisInput> {
  const [repositories, events] = await Promise.all([
    githubFetch<GitHubRepo[]>(
      "/user/repos?per_page=50&sort=pushed&affiliation=owner,collaborator,organization_member",
      accessToken,
    ),
    githubFetch<GitHubEvent[]>(
      `/users/${encodeURIComponent(username)}/events/public?per_page=50`,
      accessToken,
    ),
  ]);

  const topRepos = repositories.slice(0, 16);
  const languageEntries = await Promise.all(
    topRepos.map(async (repo) => {
      try {
        const languages = await githubFetch<Record<string, number>>(
          `/repos/${repo.full_name}/languages`,
          accessToken,
        );
        return languages;
      } catch {
        return {};
      }
    }),
  );

  const languages = languageEntries.reduce<Record<string, number>>((acc, entry) => {
    for (const [language, bytes] of Object.entries(entry)) {
      acc[language] = (acc[language] ?? 0) + bytes;
    }
    return acc;
  }, {});

  const pullRequests = events
    .filter((event) => event.type === "PullRequestEvent")
    .slice(0, 20)
    .map((event) => ({
      title: event.payload?.pull_request?.title ?? "Untitled pull request",
      repository:
        event.payload?.pull_request?.base?.repo?.full_name ??
        event.repo?.name ??
        "unknown/repository",
      state: event.payload?.pull_request?.state ?? "unknown",
      merged: Boolean(event.payload?.pull_request?.merged),
      url: event.payload?.pull_request?.html_url ?? null,
    }));

  const contributions = events.slice(0, 40).map((event) => ({
    type: event.type,
    repository: event.repo?.name ?? "unknown/repository",
    action: event.payload?.action ?? null,
    createdAt: event.created_at ?? null,
  }));

  return {
    repositories: topRepos,
    languages,
    pullRequests,
    contributions,
  };
}
