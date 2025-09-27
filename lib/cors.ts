export const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGINS ?? "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export function ok(body: unknown, extra: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json", ...corsHeaders, ...extra },
    status: 200,
  });
}

export function created(body: unknown, extra: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json", ...corsHeaders, ...extra },
    status: 201,
  });
}

export function badRequest(message: string, extra: HeadersInit = {}) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { "Content-Type": "application/json", ...corsHeaders, ...extra },
    status: 400,
  });
}

export function serverError(message: string, extra: HeadersInit = {}) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { "Content-Type": "application/json", ...corsHeaders, ...extra },
    status: 500,
  });
}

export function options() {
  return new Response(null, { headers: corsHeaders, status: 200 });
}
