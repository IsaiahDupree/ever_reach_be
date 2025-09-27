import { ok, options, buildCorsHeaders } from "@/lib/cors";
import { getUser } from "@/lib/auth";

export const runtime = 'nodejs';

export async function OPTIONS(req: Request) {
  return options(req);
}

export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) {
    const origin = req.headers.get('origin') ?? undefined;
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(origin) },
    });
  }
  return ok({ user }, req);
}
