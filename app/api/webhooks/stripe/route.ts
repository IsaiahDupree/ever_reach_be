import { ok, options, badRequest } from "@/lib/cors";

export const runtime = 'nodejs';

export async function OPTIONS(){ return options(); }

export async function POST(req: Request){
  const sig = req.headers.get('stripe-signature');
  if (!sig) return badRequest('Missing stripe-signature');
  // TODO: verify signature with STRIPE_WEBHOOK_SECRET
  // For now, log and accept
  const body = await req.text();
  console.warn('[stripe webhook] received (unverified):', body.slice(0, 200));
  return ok({ received: true });
}
