import { buildCorsHeaders, options } from "@/lib/cors";
import { getUser } from "@/lib/auth";

export function OPTIONS(req: Request) {
  return options(req);
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin") ?? undefined;
  const user = await getUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...buildCorsHeaders(origin) },
    });
  }
  return new Response(JSON.stringify({ userId: user.id }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...buildCorsHeaders(origin) },
  });
}
