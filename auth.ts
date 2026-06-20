import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { NextResponse } from "next/server";

import { getBillingProfile, upsertGitHubProfile } from "@/lib/supabase-admin";

type GitHubProfile = {
  id?: number | string;
  login?: string | null;
  avatar_url?: string | null;
  name?: string | null;
  bio?: string | null;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "github") return true;

      const githubProfile = profile as GitHubProfile | undefined;
      const githubId = githubProfile?.id?.toString();

      if (!githubId) return false;

      await upsertGitHubProfile({
        githubId,
        username: githubProfile?.login ?? null,
        avatar: githubProfile?.avatar_url ?? null,
        name: githubProfile?.name ?? null,
        bio: githubProfile?.bio ?? null,
      });

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "github") {
        const githubProfile = profile as GitHubProfile | undefined;
        token.githubId = githubProfile?.id?.toString();
        token.githubAccessToken = account.access_token;
        token.username = githubProfile?.login ?? token.name ?? null;
        token.avatar = githubProfile?.avatar_url ?? token.picture ?? null;
        token.bio = githubProfile?.bio ?? null;
      }

      if (typeof token.githubId === "string") {
        try {
          const billingProfile = await getBillingProfile(token.githubId);
          token.plan = billingProfile.plan;
          token.subscriptionStatus = billingProfile.subscriptionStatus;
        } catch {
          token.plan = "free";
          token.subscriptionStatus = "inactive";
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.githubId =
        typeof token.githubId === "string" ? token.githubId : undefined;
      session.githubAccessToken =
        typeof token.githubAccessToken === "string"
          ? token.githubAccessToken
          : undefined;
      session.user.username =
        typeof token.username === "string" ? token.username : null;
      session.user.avatar =
        typeof token.avatar === "string" ? token.avatar : session.user.image ?? null;
      session.user.bio = typeof token.bio === "string" ? token.bio : null;
      session.user.plan =
        token.plan === "pro" || token.plan === "team" ? token.plan : "free";
      session.user.subscriptionStatus =
        typeof token.subscriptionStatus === "string"
          ? token.subscriptionStatus
          : "inactive";

      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isAuthenticated = Boolean(auth?.user);
      const plan = auth?.user?.plan;
      const isProtected =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/repositories") ||
        pathname.startsWith("/recommendations") ||
        pathname.startsWith("/analytics");

      if (!isProtected) return true;
      if (!isAuthenticated) return false;
      if (
        pathname.startsWith("/analytics") &&
        plan !== "pro" &&
        plan !== "team"
      ) {
        return NextResponse.redirect(new URL("/pricing", request.nextUrl));
      }

      return isAuthenticated;
    },
  },
});
