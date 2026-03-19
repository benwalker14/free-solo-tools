import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);

  const { plan } = await request.json();

  const isLifetime = plan === "lifetime";
  const priceId = isLifetime
    ? process.env.STRIPE_PRICE_ID_LIFETIME
    : plan === "yearly"
      ? process.env.STRIPE_PRICE_ID_YEARLY
      : process.env.STRIPE_PRICE_ID_MONTHLY;

  if (!priceId) {
    return NextResponse.json(
      { error: "Price not configured" },
      { status: 503 }
    );
  }

  const origin = request.headers.get("origin") || "https://devbolt.dev";

  const session = await stripe.checkout.sessions.create({
    mode: isLifetime ? "payment" : "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,
    ...(isLifetime && {
      payment_intent_data: {
        metadata: { plan_type: "lifetime" },
      },
    }),
  });

  return NextResponse.json({ url: session.url });
}
