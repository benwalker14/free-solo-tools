import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateApiKey } from "@/lib/api-auth";

/**
 * Stripe webhook handler.
 * Handles checkout.session.completed to generate API keys for Pro subscribers.
 * Handles customer.subscription.deleted to revoke API keys.
 *
 * Setup: Create a webhook in Stripe Dashboard pointing to https://devbolt.dev/api/webhook
 * Events: checkout.session.completed, customer.subscription.deleted
 * Set STRIPE_WEBHOOK_SECRET in environment variables.
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Allow unsigned events in development (no webhook secret configured)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;

      if (customerId) {
        // Check if customer already has an API key
        const customer = await stripe.customers.retrieve(customerId);
        if (
          !customer.deleted &&
          !customer.metadata?.api_key
        ) {
          const apiKey = generateApiKey();
          const metadata: Record<string, string> = { api_key: apiKey };

          // Mark lifetime purchases so auth can recognize them without a subscription
          if (session.mode === "payment") {
            metadata.plan_type = "lifetime";
          }

          await stripe.customers.update(customerId, { metadata });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      // Don't revoke API key for lifetime customers
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.metadata?.plan_type === "lifetime") {
        break;
      }

      // Remove API key when subscription is canceled
      await stripe.customers.update(customerId, {
        metadata: { api_key: "" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
