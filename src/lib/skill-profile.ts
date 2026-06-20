import OpenAI from "openai";

import type { GitHubAnalysisInput } from "@/lib/github-analysis";

export type SkillProfile = {
  skills: Array<{ name: string; level: number; evidence: string }>;
  expertiseScore: number;
  technologies: string[];
  interestCategories: string[];
  summary: string;
};

const skillProfileSchema = {
  name: "contribly_skill_profile",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "skills",
      "expertiseScore",
      "technologies",
      "interestCategories",
      "summary",
    ],
    properties: {
      skills: {
        type: "array",
        minItems: 3,
        maxItems: 8,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "level", "evidence"],
          properties: {
            name: { type: "string" },
            level: { type: "integer", minimum: 1, maximum: 100 },
            evidence: { type: "string" },
          },
        },
      },
      expertiseScore: { type: "integer", minimum: 1, maximum: 100 },
      technologies: {
        type: "array",
        minItems: 3,
        maxItems: 12,
        items: { type: "string" },
      },
      interestCategories: {
        type: "array",
        minItems: 2,
        maxItems: 8,
        items: { type: "string" },
      },
      summary: { type: "string" },
    },
  },
} as const;

export async function createSkillProfile(
  input: GitHubAnalysisInput,
): Promise<SkillProfile> {
  if (!process.env.OPENAI_API_KEY) {
    return createFallbackSkillProfile(input);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You analyze GitHub contribution data and produce concise developer skill profiles. Be evidence-based and avoid overstating seniority.",
      },
      {
        role: "user",
        content: JSON.stringify({
          repositories: input.repositories.map((repo) => ({
            name: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            fork: repo.fork,
            pushedAt: repo.pushed_at,
          })),
          languages: input.languages,
          pullRequests: input.pullRequests,
          contributions: input.contributions,
        }),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: skillProfileSchema,
    },
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return a skill profile.");
  }

  return JSON.parse(content) as SkillProfile;
}

function createFallbackSkillProfile(input: GitHubAnalysisInput): SkillProfile {
  const technologies = Object.entries(input.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([language]) => language);

  const repoCount = input.repositories.length;
  const prCount = input.pullRequests.length;
  const contributionCount = input.contributions.length;
  const expertiseScore = Math.max(
    35,
    Math.min(92, repoCount * 4 + prCount * 5 + contributionCount),
  );

  return {
    expertiseScore,
    technologies: technologies.length ? technologies : ["Open Source", "GitHub"],
    interestCategories: ["Open Source", "Developer Tools", "Collaboration"],
    summary:
      "Profile generated from GitHub activity. Add OPENAI_API_KEY for deeper AI analysis.",
    skills: [
      {
        name: "Repository exploration",
        level: Math.min(100, 45 + repoCount * 4),
        evidence: `${repoCount} recent repositories analyzed.`,
      },
      {
        name: "Contribution workflow",
        level: Math.min(100, 40 + prCount * 8),
        evidence: `${prCount} recent pull request events found.`,
      },
      {
        name: "Open-source activity",
        level: Math.min(100, 35 + contributionCount * 2),
        evidence: `${contributionCount} public contribution events reviewed.`,
      },
    ],
  };
}
