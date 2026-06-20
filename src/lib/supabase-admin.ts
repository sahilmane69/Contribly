import { createClient } from "@supabase/supabase-js";

import type { GitHubAnalysisInput } from "@/lib/github-analysis";
import type { SkillProfile } from "@/lib/skill-profile";

type ProfileInput = {
  githubId: string;
  username: string | null;
  avatar: string | null;
  name: string | null;
  bio: string | null;
};

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function upsertGitHubProfile(profile: ProfileInput) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("profiles").upsert(
    {
      github_id: profile.githubId,
      username: profile.username,
      avatar: profile.avatar,
      name: profile.name,
      bio: profile.bio,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "github_id" },
  );

  if (error) {
    throw new Error(`Failed to upsert GitHub profile: ${error.message}`);
  }
}

export async function upsertSkillProfile({
  githubId,
  githubInput,
  skillProfile,
}: {
  githubId: string;
  githubInput: GitHubAnalysisInput;
  skillProfile: SkillProfile;
}) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("github_skill_profiles").upsert(
    {
      github_id: githubId,
      repositories: githubInput.repositories,
      languages: githubInput.languages,
      pull_requests: githubInput.pullRequests,
      contributions: githubInput.contributions,
      skills: skillProfile.skills,
      expertise_score: skillProfile.expertiseScore,
      technologies: skillProfile.technologies,
      interest_categories: skillProfile.interestCategories,
      summary: skillProfile.summary,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "github_id" },
  );

  if (error) {
    throw new Error(`Failed to upsert skill profile: ${error.message}`);
  }
}

export async function getSkillProfile(githubId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("github_skill_profiles")
    .select("*")
    .eq("github_id", githubId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load skill profile: ${error.message}`);
  }

  return data;
}

export async function getRepositoryFollows(githubId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("followed_repositories")
    .select("repository_id,is_favorite")
    .eq("github_id", githubId);

  if (error) {
    throw new Error(`Failed to load followed repositories: ${error.message}`);
  }

  return data ?? [];
}

export async function followRepository({
  githubId,
  repositoryId,
  isFavorite = false,
}: {
  githubId: string;
  repositoryId: string;
  isFavorite?: boolean;
}) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("followed_repositories").upsert(
    {
      github_id: githubId,
      repository_id: repositoryId,
      is_favorite: isFavorite,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "github_id,repository_id" },
  );

  if (error) {
    throw new Error(`Failed to follow repository: ${error.message}`);
  }
}

export async function unfollowRepository({
  githubId,
  repositoryId,
}: {
  githubId: string;
  repositoryId: string;
}) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("followed_repositories")
    .delete()
    .eq("github_id", githubId)
    .eq("repository_id", repositoryId);

  if (error) {
    throw new Error(`Failed to unfollow repository: ${error.message}`);
  }
}

export async function setRepositoryFavorite({
  githubId,
  repositoryId,
  isFavorite,
}: {
  githubId: string;
  repositoryId: string;
  isFavorite: boolean;
}) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("followed_repositories").upsert(
    {
      github_id: githubId,
      repository_id: repositoryId,
      is_favorite: isFavorite,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "github_id,repository_id" },
  );

  if (error) {
    throw new Error(`Failed to update favorite repository: ${error.message}`);
  }
}
