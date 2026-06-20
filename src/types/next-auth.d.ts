import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    githubAccessToken?: string;
    user: {
      githubId?: string;
      username?: string | null;
      avatar?: string | null;
      bio?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubId?: string;
    githubAccessToken?: string;
    username?: string | null;
    avatar?: string | null;
    bio?: string | null;
  }
}
