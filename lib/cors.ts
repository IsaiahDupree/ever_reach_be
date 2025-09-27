// Dynamic CORS helper with allowlist and Origin echoing
// - Allowed origins default to a conservative set and can be extended via env CORS_ORIGINS (comma-separated)
// - Adds Vary: Origin for proper caching behavior

const STATIC_ALLOWED = new Set<string>([
  'https://ai-enhanced-personal-crm.rork.app',
  'https://rork.com',
]);

function parseEnvAllowlist(): Set<string> {
  const out = new Set<string>();
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) return out;
  for (const part of raw.split(',')) {
    const v = part.trim();
    if (v) out.add(v);
  }
  return out;
}

function isRequest(obj: unknown): obj is Request {
  return !!obj && typeof (obj as any).headers?.get === 'function';
}

export function buildCorsHeaders(origin?: string): HeadersInit {
  const allowlist = new Set<string>([...STATIC_ALLOWED, ...parseEnvAllowlist()]);
  const allow = origin && allowlist.has(origin) ? origin : '';
  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type,x-vercel-protection-bypass',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
  if (allow) headers['Access-Control-Allow-Origin'] = allow;
  return headers;
}

export function options(req?: Request) {
  const origin = req?.headers?.get('origin') ?? undefined;
  return new Response(null, { headers: buildCorsHeaders(origin), status: 200 });
}

// Backward-compatible response helpers. Accept either extra headers or a Request as 2nd arg.
export function ok(body: unknown, extraOrReq: HeadersInit | Request = {}, maybeExtra: HeadersInit = {}) {
  const origin = isRequest(extraOrReq) ? extraOrReq.headers.get('origin') ?? undefined : undefined;
  const extra = isRequest(extraOrReq) ? maybeExtra : (extraOrReq as HeadersInit);
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(origin), ...extra },
    status: 200,
  });
}

export function created(body: unknown, extraOrReq: HeadersInit | Request = {}, maybeExtra: HeadersInit = {}) {
  const origin = isRequest(extraOrReq) ? extraOrReq.headers.get('origin') ?? undefined : undefined;
  const extra = isRequest(extraOrReq) ? maybeExtra : (extraOrReq as HeadersInit);
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(origin), ...extra },
    status: 201,
  });
}

export function badRequest(message: string, extraOrReq: HeadersInit | Request = {}, maybeExtra: HeadersInit = {}) {
  const origin = isRequest(extraOrReq) ? extraOrReq.headers.get('origin') ?? undefined : undefined;
  const extra = isRequest(extraOrReq) ? maybeExtra : (extraOrReq as HeadersInit);
  return new Response(JSON.stringify({ error: message }), {
    headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(origin), ...extra },
    status: 400,
  });
}

export function serverError(message: string, extraOrReq: HeadersInit | Request = {}, maybeExtra: HeadersInit = {}) {
  const origin = isRequest(extraOrReq) ? extraOrReq.headers.get('origin') ?? undefined : undefined;
  const extra = isRequest(extraOrReq) ? maybeExtra : (extraOrReq as HeadersInit);
  return new Response(JSON.stringify({ error: message }), {
    headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(origin), ...extra },
    status: 500,
  });
}
