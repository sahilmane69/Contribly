"use server";

import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { getAppUrl, getPriceIdForPlan, getStripe } from "@/lib/stripe";
import {
  getBillingProfile,
  updateStripeCustomerId,
} from "@/lib/supabase-admin";

export async function createCheckoutSession(formData: FormData) {
  const session = await auth();
  const selectedPlan = String(formData.get("plan"));

  if (!session?.user?.githubId) {
    redirect("/sign-in/github");
  }

  if (selectedPlan !== "pro" && selectedPlan !== "team") {
    redirect("/pricing");
  }

  const stripe = getStripe();
  const billingProfile = await getBillingProfile(session.user.githubId);
  const priceId = getPriceIdForPlan(selectedPlan);
  const appUrl = getAppUrl();

  let customerId = billingProfile.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      name: session.user.name ?? session.user.username ?? undefined,
      metadata: {
        githubId: session.user.githubId,
        username: session.user.username ?? "",
      },
    });
    customerId = customer.id;
    await updateStripeCustomerId({
      githubId: session.user.githubId,
      stripeCustomerId: customerId,
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: {
      githubId: session.user.githubId,
      plan: selectedPlan,
    },
    subscription_data: {
      metadata: {
        githubId: session.user.githubId,
        plan: selectedPlan,
      },
    },
  });

  if (!checkout.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(checkout.url);
}
