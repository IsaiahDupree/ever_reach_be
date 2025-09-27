import 'server-only';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: Request) {
  try {
    const [{ fetchRequestHandler }, { appRouter }, { createContext }] = await Promise.all([
      import('@trpc/server/adapters/fetch'),
      import('../../../backend/trpc/app-router'),
      import('../../../backend/trpc/server'),
    ]);

    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req: request,
      router: appRouter,
      createContext,
      onError: ({ path, error }) => {
        console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
      },
    });
  } catch (error: any) {
    console.error('[tRPC API] Handler error:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
