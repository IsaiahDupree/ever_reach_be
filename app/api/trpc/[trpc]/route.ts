export const runtime = 'nodejs';

export async function GET(request: Request) {
  const [{ fetchRequestHandler }, { appRouter }, { createContext }] = await Promise.all([
    import('@trpc/server/adapters/fetch'),
    import('../../../../backend/trpc/app-router'),
    import('../../../../backend/trpc/server'),
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
}

export const POST = GET;
export const OPTIONS = GET;
