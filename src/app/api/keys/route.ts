import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * GET /api/keys?session_id=cs_...
 * Retrieves the API key for a Stripe checkout session.
 * Used by the checkout success page to show the user their key.
 */
export async function GET(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id parameter" },
      { status: 400 }
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customerId = session.customer as string;

    if (!customerId) {
      return NextResponse.json(
        { error: "No customer found for this session" },
        { status: 404 }
      );
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const apiKey = customer.metadata?.api_key;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not yet generated. Please wait a moment and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      api_key: apiKey,
      email: customer.email,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not retrieve API key. Check your session ID." },
      { status: 400 }
    );
  }
}
