import { ok, options, buildCorsHeaders } from "@/lib/cors";
import { getUser } from "@/lib/auth";
import { getClientOrThrow } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";

function getOrigin(req: Request) {
  return req.headers.get("origin") ?? undefined;
}

function jsonError(status: number, code: string, message: string, details: any, origin?: string) {
  return new Response(
    JSON.stringify({ error: { code, message, details } }),
    { status, headers: { "Content-Type": "application/json", ...buildCorsHeaders(origin) } }
  );
}

export function OPTIONS(req: Request) {
  return options(req);
}

export async function GET(req: Request) {
  const origin = getOrigin(req);

  const user = await getUser(req);
  if (!user) return jsonError(401, "unauthorized", "Missing or invalid access token", null, origin);

  const rl = checkRateLimit(`u:${user.id}:GET:/contacts/search`, 60, 60_000);
  if (!rl.allowed) {
    const res = jsonError(429, "rate_limited", "Too many requests", { retryAfter: rl.retryAfter }, origin);
    res.headers.set("Retry-After", String(rl.retryAfter ?? 60));
    return res;
  }

  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const limitParam = Number(url.searchParams.get("limit") || "10");
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;

    if (!q) return jsonError(400, "missing_q", "Query parameter 'q' is required", null, origin);

    const supabase = getClientOrThrow(req);

    // Prefer full-text search on precomputed tsvector; fallback to ILIKE if needed
    const { data, error } = await supabase
      .from("contacts")
      .select("id, display_name, emails, phones, company, tags, updated_at")
      .textSearch("search_tsv", q, { type: "websearch" })
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) return jsonError(500, "db_search_failed", "Failed to search contacts", { hint: error.message }, origin);

    return ok({ items: data ?? [], limit, q }, req);
  } catch (err: any) {
    return jsonError(500, "unexpected", "Unexpected server error", { message: err?.message }, origin);
  }
}
