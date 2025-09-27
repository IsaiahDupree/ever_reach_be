# Personal CRM Backend (Vercel)

This is a standalone Next.js project that exposes the backend API for the AI‑Enhanced Personal CRM. It reuses the existing backend code from the parent repo and is meant to be deployed independently on Vercel.

## Structure

- `app/api/[...api]/route.ts` — Catch‑all that proxies to the Hono app defined in `../../backend/hono.ts`.
- `app/api/trpc/[trpc]/route.ts` — tRPC handler bound to the router defined in `../../backend/trpc/app-router.ts` with context from `../../backend/trpc/server.ts`.

The project is configured with `experimental.externalDir=true` so it can import code from the parent directory without duplicating logic.

## Local dev

```bash
bun install # or npm/pnpm/yarn
bun run dev # or npm run dev
```

Note: API routes run on port 3000 by default; this project uses 3001 in the `start` script.

## Deploy to Vercel

- Create a new Vercel project pointing to this `backend-vercel/` directory as the Root Directory.
- Set Environment Variables:
  - Server‑only: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (and optionally `SUPABASE_ANON_KEY`)
  - Client‑safe (optional): `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`
- After deploy:
  - `GET https://<your-project>.vercel.app/api/health` should return JSON
  - `POST https://<your-project>.vercel.app/api/llm/chat` should proxy OpenAI
  - `https://<your-project>.vercel.app/api/trpc` serves your tRPC router

See the parent repo docs at `../docs/API_and_Deployment.md` for more details.
