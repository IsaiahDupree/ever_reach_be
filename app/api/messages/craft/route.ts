import OpenAI from 'openai';
import { ok, options, badRequest, serverError } from "@/lib/cors";
import { craftMessageSchema } from "@/lib/validation";

export const runtime = 'nodejs';

// simple in-memory limiter per IP
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000; // 1 minute
const LIMIT = 30; // 30 requests per minute per IP

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry || now > entry.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count < LIMIT) {
    entry.count++;
    return true;
  }
  return false;
}

export async function OPTIONS(){ return options(); }

export async function POST(req: Request){
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) return badRequest('Rate limit exceeded');

    const body = await req.json();
    const parsed = craftMessageSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!client.apiKey) return serverError('Missing OPENAI_API_KEY');

    const { tone = 'friendly', purpose, context = '', to } = parsed.data;
    const prompt = `Craft a ${tone} message for the following purpose: ${purpose}.\nContext: ${context}.\nRecipient: ${to?.name || ''} ${to?.email || ''}`;

    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 300,
    });

    // @ts-ignore - output_text available in SDK response helper
    const text: string = (resp as any).output_text ?? '';
    return ok({ message: text.trim() });
  } catch (err: any) {
    return serverError(err?.message || 'Internal error');
  }
}
