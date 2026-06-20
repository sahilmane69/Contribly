import { headers } from "next/headers";
import type Stripe from "stripe";

import { normalizePlan, type PlanRole } from "@/lib/billing";
import { getStripe } from "@/lib/stripe";
import {
  getProfileByStripeCustomerId,
  recordBillingEvent,
  upsertSubscription,
} from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET environment variable." },
      { status: 500 },
    );
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook.";
    return Response.json({ error: message }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await handleBillingEvent(event);
  }

  return Response.json({ received: true });
}

async function handleBillingEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await recordBillingEvent({
      eventType: event.type,
      githubId: session.metadata?.githubId ?? null,
      payload: session,
      plan: normalizePlan(session.metadata?.plan),
      status: session.status ?? null,
      stripeEventId: event.id,
    });
    return;
  }

  const subscription = event.data.object as Stripe.Subscription;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const profile = await getProfileByStripeCustomerId(customerId);
  const githubId = subscription.metadata.githubId ?? profile?.github_id;

  if (!githubId) {
    await recordBillingEvent({
      eventType: event.type,
      githubId: null,
      payload: subscription,
      plan: normalizePlan(subscription.metadata.plan),
      status: subscription.status,
      stripeEventId: event.id,
    });
    return;
  }

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const plan = normalizePlan(subscription.metadata.plan) as PlanRole;
  const period = getSubscriptionPeriod(subscription);

  await upsertSubscription({
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: toIsoDate(period.end),
    currentPeriodStart: toIsoDate(period.start),
    githubId,
    plan,
    status: subscription.status,
    stripeCustomerId: customerId,
    stripePriceId: priceId,
    stripeSubscriptionId: subscription.id,
  });

  await recordBillingEvent({
    eventType: event.type,
    githubId,
    payload: subscription,
    plan,
    status: subscription.status,
    stripeEventId: event.id,
  });
}

function toIsoDate(timestamp: number | null | undefined) {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

function getSubscriptionPeriod(subscription: Stripe.Subscription) {
  const subscriptionWithPeriod = subscription as Stripe.Subscription & {
    current_period_end?: number;
    current_period_start?: number;
  };
  const itemWithPeriod = subscription.items.data[0] as
    | (Stripe.SubscriptionItem & {
        current_period_end?: number;
        current_period_start?: number;
      })
    | undefined;

  return {
    end:
      subscriptionWithPeriod.current_period_end ??
      itemWithPeriod?.current_period_end,
    start:
      subscriptionWithPeriod.current_period_start ??
      itemWithPeriod?.current_period_start,
  };
}
