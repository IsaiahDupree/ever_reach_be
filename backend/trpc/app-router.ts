import 'server-only';
import { router, publicProcedure } from './server';
import { z } from 'zod';

// Simple health check procedure
const healthRouter = router({
  check: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'tRPC is working',
      timestamp: new Date().toISOString(),
    };
  }),
});

// Main app router
export const appRouter = router({
  health: healthRouter,
  // Add more routers here as needed (contacts, messages, etc.)
});

export type AppRouter = typeof appRouter;
