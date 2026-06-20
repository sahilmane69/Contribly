"use server";

import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { fetchGitHubAnalysisInput } from "@/lib/github-analysis";
import { createSkillProfile } from "@/lib/skill-profile";
import { upsertSkillProfile } from "@/lib/supabase-admin";

export async function generateOnboardingProfile() {
  const session = await auth();

  if (!session?.user?.githubId || !session.githubAccessToken) {
    redirect("/");
  }

  const username = session.user.username ?? session.user.name;
  if (!username) {
    throw new Error("GitHub username is missing from the session.");
  }

  const githubInput = await fetchGitHubAnalysisInput(
    session.githubAccessToken,
    username,
  );
  const skillProfile = await createSkillProfile(githubInput);

  await upsertSkillProfile({
    githubId: session.user.githubId,
    githubInput,
    skillProfile,
  });

  redirect("/dashboard");
}
