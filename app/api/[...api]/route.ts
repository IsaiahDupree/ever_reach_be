// Catch-all API route - removed Hono dependency
// This backend uses tRPC at /api/trpc and specific route handlers

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const notFoundResponse = new Response(
  JSON.stringify({
    error: 'Not Found',
    message: 'Use /api/trpc for tRPC calls or /api/health for health checks',
  }),
  {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  }
);

export async function GET() {
  return notFoundResponse;
}

export async function POST() {
  return notFoundResponse;
}

export async function PUT() {
  return notFoundResponse;
}

export async function DELETE() {
  return notFoundResponse;
}

export async function PATCH() {
  return notFoundResponse;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
