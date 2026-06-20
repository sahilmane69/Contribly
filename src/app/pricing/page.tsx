import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createCheckoutSession } from "@/app/actions/billing";
import { PricingCard } from "@/components/billing/pricing-card";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "../../../auth";
import { getBillingProfile } from "@/lib/supabase-admin";

const plans = [
  {
    name: "Free Plan",
    planId: "free",
    price: "$0/month",
    description: "Start discovering issues and build your contribution profile.",
    cta: "Current Plan",
    features: [
      "GitHub Login",
      "Skill Analysis",
      "Follow 5 Repositories",
      "Issue Discovery",
      "Basic Contribution Dashboard",
      "20 AI Recommendations per month",
    ],
  },
  {
    name: "Pro Plan",
    planId: "pro",
    price: "$9/month",
    description: "The AI contribution workspace for active open-source builders.",
    cta: "Upgrade to Pro",
    highlighted: true,
    features: [
      "Unlimited AI Recommendations",
      "AI Contribution Copilot",
      "AI Issue Explanations",
      "Codebase Understanding",
      "AI Solution Review",
      "PR Description Generator",
      "Discord Notifications",
      "Advanced Analytics",
    ],
  },
  {
    name: "Team Plan",
    planId: "team",
    price: "$39/month",
    description: "Maintainer-grade analytics and contributor matching for teams.",
    cta: "Contact Sales",
    features: [
      "Everything in Pro",
      "Contributor Matching",
      "Repository Analytics",
      "Contributor Insights",
      "Team Dashboard",
      "Maintainer Tools",
    ],
  },
];

export default async function PricingPage() {
  const session = await auth();
  const billing = session?.user?.githubId
    ? await getBillingProfile(session.user.githubId)
    : null;

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>
          {session?.user ? (
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/sign-in/github">Sign in</Link>
            </Button>
          )}
        </div>

        <section className="mx-auto max-w-4xl py-12 text-center md:py-20">
          <p className="text-sm font-medium text-muted-foreground">Pricing</p>
          <h1 className="mt-4 text-5xl font-semibold leading-none tracking-normal md:text-7xl">
            Simple plans for open-source builders.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            Pick the level of AI help you need. Start free, upgrade when you
            want deeper contribution workflows.
          </p>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = billing?.plan === plan.planId;
            const isTeamContact = plan.planId === "team";

            return (
              <PricingCard
                key={plan.planId}
                {...plan}
                action={
                  plan.planId === "free" || isTeamContact || isCurrentPlan
                    ? undefined
                    : createCheckoutSession
                }
                cta={
                  isCurrentPlan
                    ? "Current Plan"
                    : isTeamContact
                      ? "Contact Sales"
                      : plan.cta
                }
              />
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Billing architecture</p>
              <CardTitle className="text-2xl">
              Stripe Checkout, Supabase truth.
              </CardTitle>
              <CardDescription>
                Checkout creates subscriptions, webhooks update Supabase, and the
                app reads role access from the user profile.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Role access</p>
              <CardTitle className="text-2xl">
              Free, Pro, and Team gates.
              </CardTitle>
              <CardDescription>
                Pro and Team plans unlock advanced analytics and future copilot
                features through reusable server-side plan checks.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">AI credits</p>
              <CardTitle className="text-2xl">
              Free users start with 20.
              </CardTitle>
              <CardDescription>
                The dashboard displays remaining monthly credits for free users and
                a plan badge for paid plans.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
