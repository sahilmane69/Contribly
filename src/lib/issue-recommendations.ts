import OpenAI from "openai";

import type { CuratedRepository } from "@/lib/repositories/curated";

export type StoredSkillProfile = {
  skills: Array<{ name: string; level: number; evidence: string }>;
  expertise_score: number | null;
  technologies: string[];
  interest_categories: string[];
  summary: string | null;
};

export type OpenIssue = {
  id: number;
  title: string;
  url: string;
  repository: string;
  repositoryId: string;
  labels: string[];
  comments: number;
  createdAt: string;
};

export type IssueRecommendation = {
  issueId: number;
  repositoryId: string;
  repository: string;
  title: string;
  url: string;
  matchScore: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedCompletionTime: string;
  whyItMatches: string;
  technologies: string[];
};

type GitHubIssue = {
  id: number;
  title: string;
  html_url: string;
  labels: Array<{ name?: string }>;
  comments: number;
  created_at: string;
  pull_request?: unknown;
};

const recommendationSchema = {
  name: "contribly_issue_recommendations",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["recommendations"],
    properties: {
      recommendations: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "issueId",
            "repositoryId",
            "repository",
            "title",
            "url",
            "matchScore",
            "difficulty",
            "estimatedCompletionTime",
            "whyItMatches",
            "technologies",
          ],
          properties: {
            issueId: { type: "integer" },
            repositoryId: { type: "string" },
            repository: { type: "string" },
            title: { type: "string" },
            url: { type: "string" },
            matchScore: { type: "integer", minimum: 1, maximum: 100 },
            difficulty: {
              type: "string",
              enum: ["Beginner", "Intermediate", "Advanced"],
            },
            estimatedCompletionTime: { type: "string" },
            whyItMatches: { type: "string" },
            technologies: {
              type: "array",
              minItems: 1,
              maxItems: 5,
              items: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;

async function githubFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} for ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchOpenIssuesForRepositories({
  accessToken,
  repositories,
}: {
  accessToken: string;
  repositories: CuratedRepository[];
}) {
  const issueGroups = await Promise.all(
    repositories.map(async (repo) => {
      try {
        const issues = await githubFetch<GitHubIssue[]>(
          `/repos/${repo.fullName}/issues?state=open&per_page=12&sort=updated`,
          accessToken,
        );

        return issues
          .filter((issue) => !issue.pull_request)
          .slice(0, 5)
          .map<OpenIssue>((issue) => ({
            id: issue.id,
            title: issue.title,
            url: issue.html_url,
            repository: repo.fullName,
            repositoryId: repo.id,
            labels: issue.labels
              .map((label) => label.name)
              .filter((label): label is string => Boolean(label)),
            comments: issue.comments,
            createdAt: issue.created_at,
          }));
      } catch {
        return [];
      }
    }),
  );

  return issueGroups.flat().slice(0, 24);
}

export async function createIssueRecommendations({
  profile,
  repositories,
  issues,
}: {
  profile: StoredSkillProfile;
  repositories: CuratedRepository[];
  issues: OpenIssue[];
}): Promise<IssueRecommendation[]> {
  if (!issues.length) return [];

  if (!process.env.OPENAI_API_KEY) {
    return createFallbackRecommendations({ profile, repositories, issues });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You recommend open-source GitHub issues to developers. Return only realistic matches grounded in the user's skills, followed repositories, issue titles, labels, and repository metadata.",
      },
      {
        role: "user",
        content: JSON.stringify({
          profile: {
            skills: profile.skills,
            expertiseScore: profile.expertise_score,
            technologies: profile.technologies,
            interestCategories: profile.interest_categories,
            summary: profile.summary,
          },
          repositories: repositories.map((repo) => ({
            id: repo.id,
            fullName: repo.fullName,
            language: repo.language,
            category: repo.category,
            difficulty: repo.difficulty,
            description: repo.description,
          })),
          issues,
        }),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: recommendationSchema,
    },
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return issue recommendations.");
  }

  const parsed = JSON.parse(content) as {
    recommendations: IssueRecommendation[];
  };

  return parsed.recommendations
    .filter((recommendation) =>
      issues.some((issue) => issue.id === recommendation.issueId),
    )
    .slice(0, 8);
}

function createFallbackRecommendations({
  profile,
  repositories,
  issues,
}: {
  profile: StoredSkillProfile;
  repositories: CuratedRepository[];
  issues: OpenIssue[];
}) {
  const technologies = new Set(
    (profile.technologies ?? []).map((technology) => technology.toLowerCase()),
  );

  return issues
    .map((issue) => {
      const repo = repositories.find((item) => item.id === issue.repositoryId);
      const languageMatch = repo
        ? technologies.has(repo.language.toLowerCase())
        : false;
      const beginnerSignal = issue.labels.some((label) =>
        /good first issue|beginner|starter|help wanted/i.test(label),
      );
      const score = Math.min(
        97,
        Math.max(
          62,
          68 +
            (languageMatch ? 16 : 0) +
            (beginnerSignal ? 10 : 0) +
            Math.round((profile.expertise_score ?? 50) / 10),
        ),
      );

      return {
        issueId: issue.id,
        repositoryId: issue.repositoryId,
        repository: issue.repository,
        title: issue.title,
        url: issue.url,
        matchScore: score,
        difficulty:
          repo?.difficulty ??
          (beginnerSignal ? "Beginner" : ("Intermediate" as const)),
        estimatedCompletionTime: beginnerSignal ? "2-4 hours" : "1-2 days",
        whyItMatches: languageMatch
          ? `This issue lines up with your ${repo?.language} experience and current interest in ${repo?.category.toLowerCase()} projects.`
          : "This issue is from a followed repository and looks approachable based on its labels and activity.",
        technologies: repo ? [repo.language] : profile.technologies.slice(0, 3),
      } satisfies IssueRecommendation;
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);
}
