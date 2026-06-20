"use server";

import { signIn, signOut } from "../../../auth";

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/onboarding" });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
