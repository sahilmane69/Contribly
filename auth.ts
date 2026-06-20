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
  providers: [
    GitHub({
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
        token.username = githubProfile?.login ?? token.name ?? null;
        token.avatar = githubProfile?.avatar_url ?? token.picture ?? null;
        token.bio = githubProfile?.bio ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.githubId =
        typeof token.githubId === "string" ? token.githubId : undefined;
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
        pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

      if (!isProtected) return true;
      return isAuthenticated;
    },
  },
});
