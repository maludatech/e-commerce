import { checkRateLimit } from "@vercel/firewall";
import { headers } from "next/headers";

// Wraps @vercel/firewall's checkRateLimit for use in Server Actions, which
// don't have direct access to a Request object. Each `rateLimitId` must have
// a matching custom rule created in the Vercel Firewall dashboard, or this
// always fails open (no rule = nothing to enforce, so don't block real users).
export async function isRateLimited(rateLimitId: string, rateLimitKey?: string) {
  try {
    const { rateLimited } = await checkRateLimit(rateLimitId, {
      headers: await headers(),
      rateLimitKey,
    });
    return rateLimited;
  } catch (error) {
    console.error(`Rate limit check failed for "${rateLimitId}":`, error);
    return false;
  }
}
