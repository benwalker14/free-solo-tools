import { NextResponse } from "next/server";
import Stripe from "stripe";

export interface ApiUser {
  customerId: string;
  email: string | null;
}

interface AuthResult {
  user?: ApiUser;
  error?: NextResponse;
}

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Validate an API key from the Authorization header.
 * Keys are stored in Stripe customer metadata (api_key field).
 * Returns the authenticated user or an error response.
 */
export async function authenticateApiKey(
  authHeader: string | null
): Promise<AuthResult> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: jsonError(
        'Missing or invalid Authorization header. Use "Bearer dvb_..." format.',
        401
      ),
    };
  }

  const apiKey = authHeader.slice(7).trim();
  if (!apiKey || !apiKey.startsWith("dvb_")) {
    return {
      error: jsonError(
        'Invalid API key format. Keys start with "dvb_".',
        401
      ),
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      error: jsonError("API service is not configured yet.", 503),
    };
  }

  try {
    // Search for customer with this API key in metadata
    const result = await stripe.customers.search({
      query: `metadata["api_key"]:"${apiKey}"`,
      limit: 1,
    });

    if (result.data.length === 0) {
      return { error: jsonError("Invalid API key.", 401) };
    }

    const customer = result.data[0];

    // Check customer has an active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return {
        error: jsonError(
          "Your Pro subscription is not active. Renew at https://devbolt.dev/pricing",
          403
        ),
      };
    }

    return {
      user: {
        customerId: customer.id,
        email: customer.email,
      },
    };
  } catch {
    return { error: jsonError("Authentication service error.", 500) };
  }
}

/** Generate a new API key with the dvb_ prefix */
export function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "dvb_";
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}
