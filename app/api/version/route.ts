import { ok, options } from "@/lib/cors";

export const runtime = 'edge';

export function OPTIONS(){ return options(); }

export function GET(){
  return ok({
    ok: true,
    ts: Date.now(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    buildId: process.env.NEXT_BUILD_ID ?? null,
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
  });
}
