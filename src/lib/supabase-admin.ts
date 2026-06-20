import { createClient } from "@supabase/supabase-js";

import {
  normalizePlan,
  type BillingProfile,
  type PlanRole,
} from "@/lib/billing";
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

export async function getBillingProfile(
  githubId: string,
): Promise<BillingProfile> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "plan,subscription_status,current_period_end,stripe_customer_id",
    )
    .eq("github_id", githubId)
    .maybeSingle();

  if (error) {
    if (
      error.message.includes("plan") ||
      error.message.includes("subscription_status") ||
      error.message.includes("stripe_customer_id")
    ) {
      return {
        plan: "free",
        subscriptionStatus: "inactive",
        currentPeriodEnd: null,
        stripeCustomerId: null,
        aiRecommendationLimit: 20,
        aiRecommendationsUsed: 0,
      };
    }

    throw new Error(`Failed to load billing profile: ${error.message}`);
  }

  const plan = normalizePlan(data?.plan);

  return {
    plan,
    subscriptionStatus: data?.subscription_status ?? "inactive",
    currentPeriodEnd: data?.current_period_end ?? null,
    stripeCustomerId: data?.stripe_customer_id ?? null,
    aiRecommendationLimit: plan === "free" ? 20 : null,
    aiRecommendationsUsed: 0,
  };
}

export async function updateStripeCustomerId({
  githubId,
  stripeCustomerId,
}: {
  githubId: string;
  stripeCustomerId: string;
}) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    })
    .eq("github_id", githubId);

  if (error) {
    throw new Error(`Failed to update Stripe customer id: ${error.message}`);
  }
}

export async function getProfileByStripeCustomerId(stripeCustomerId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("github_id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load Stripe customer profile: ${error.message}`);
  }

  return data;
}

export async function upsertSubscription({
  cancelAtPeriodEnd,
  currentPeriodEnd,
  currentPeriodStart,
  githubId,
  plan,
  status,
  stripeCustomerId,
  stripePriceId,
  stripeSubscriptionId,
}: {
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
  githubId: string;
  plan: PlanRole;
  status: string;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string;
}) {
  const supabase = getSupabaseAdmin();

  const activePlan =
    status === "active" || status === "trialing" ? plan : ("free" as const);

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .upsert(
      {
        github_id: githubId,
        plan,
        status,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_price_id: stripePriceId,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: cancelAtPeriodEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );

  if (subscriptionError) {
    throw new Error(
      `Failed to upsert subscription: ${subscriptionError.message}`,
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      plan: activePlan,
      subscription_status: status,
      current_period_end: currentPeriodEnd,
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    })
    .eq("github_id", githubId);

  if (profileError) {
    throw new Error(`Failed to update billing profile: ${profileError.message}`);
  }
}

export async function recordBillingEvent({
  eventType,
  githubId,
  payload,
  plan,
  status,
  stripeEventId,
}: {
  eventType: string;
  githubId: string | null;
  payload: unknown;
  plan: PlanRole | null;
  status: string | null;
  stripeEventId: string;
}) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("billing_events").upsert(
    {
      github_id: githubId,
      stripe_event_id: stripeEventId,
      event_type: eventType,
      plan,
      status,
      payload,
    },
    { onConflict: "stripe_event_id" },
  );

  if (error) {
    throw new Error(`Failed to record billing event: ${error.message}`);
  }
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
