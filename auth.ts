import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { upsertGitHubProfile } from "@/lib/supabase-admin";

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

      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isAuthenticated = Boolean(auth?.user);
      const isProtected =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/repositories") ||
        pathname.startsWith("/recommendations");

      if (!isProtected) return true;
      return isAuthenticated;
    },
  },
});
