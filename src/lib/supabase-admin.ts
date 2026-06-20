import { createClient } from "@supabase/supabase-js";

type ProfileInput = {
  githubId: string;
  username: string | null;
  avatar: string | null;
  name: string | null;
  bio: string | null;
};

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.",
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
