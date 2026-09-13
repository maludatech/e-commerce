import { checkRateLimit } from "@vercel/firewall";
import { headers } from "next/headers";

// Wraps @vercel/firewall's checkRateLimit for use in Server Actions, which
// don't have direct access to a Request object.
//
// The Hobby plan only allows one rate-limiting rule per project, so every
// auth-related action shares the single "auth" Rate Limit ID configured in
// the Vercel Firewall dashboard. Buckets are still kept separate per action
// (and per identity) by prefixing the key, e.g. "sign-in:user@example.com" -
// see https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk#custom-rate-limit-keys.
//
// No matching rule = this always fails open (nothing to enforce, so don't
// block real users).
export async function isRateLimited(action: string, identity = "") {
  const rateLimitKey = identity ? `${action}:${identity}` : action;
  try {
    const { rateLimited } = await checkRateLimit("auth", {
      headers: await headers(),
      rateLimitKey,
    });
    return rateLimited;
  } catch (error) {
    console.error(`Rate limit check failed for "${rateLimitKey}":`, error);
    return false;
  }
}
