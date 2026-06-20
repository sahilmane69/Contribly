"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { curatedRepositories } from "@/lib/repositories/curated";
import {
  followRepository,
  setRepositoryFavorite,
  unfollowRepository,
} from "@/lib/supabase-admin";

async function requireGithubId() {
  const session = await auth();

  if (!session?.user?.githubId) {
    redirect("/");
  }

  return session.user.githubId;
}

function getRepositoryId(formData: FormData) {
  const repositoryId = String(formData.get("repositoryId") ?? "");
  const repositoryExists = curatedRepositories.some(
    (repo) => repo.id === repositoryId,
  );

  if (!repositoryExists) {
    throw new Error("Unknown repository.");
  }

  return repositoryId;
}

export async function followRepositoryAction(formData: FormData) {
  const githubId = await requireGithubId();
  const repositoryId = getRepositoryId(formData);

  await followRepository({ githubId, repositoryId });
  revalidatePath("/repositories");
}

export async function unfollowRepositoryAction(formData: FormData) {
  const githubId = await requireGithubId();
  const repositoryId = getRepositoryId(formData);

  await unfollowRepository({ githubId, repositoryId });
  revalidatePath("/repositories");
}

export async function favoriteRepositoryAction(formData: FormData) {
  const githubId = await requireGithubId();
  const repositoryId = getRepositoryId(formData);
  const isFavorite = String(formData.get("isFavorite")) === "true";

  await setRepositoryFavorite({ githubId, repositoryId, isFavorite });
  revalidatePath("/repositories");
}
