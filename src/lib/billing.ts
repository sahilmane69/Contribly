export type PlanRole = "free" | "pro" | "team";

export type BillingProfile = {
  plan: PlanRole;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  aiRecommendationLimit: number | null;
  aiRecommendationsUsed: number;
};

export const planRank: Record<PlanRole, number> = {
  free: 0,
  pro: 1,
  team: 2,
};

export function hasPlanAccess(plan: PlanRole, requiredPlan: PlanRole) {
  return planRank[plan] >= planRank[requiredPlan];
}

export function normalizePlan(value: unknown): PlanRole {
  return value === "pro" || value === "team" ? value : "free";
}

export function getPlanLabel(plan: PlanRole) {
  if (plan === "team") return "Team Plan";
  if (plan === "pro") return "Pro Plan";
  return "Free Plan";
}

export function getRemainingAiCredits(profile: BillingProfile) {
  if (profile.aiRecommendationLimit === null) return null;
  return Math.max(0, profile.aiRecommendationLimit - profile.aiRecommendationsUsed);
}
