import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client configured for RLS using the caller's Bearer token.
 * - Uses the anon key so RLS is enforced
 * - If a Bearer token is present, it will be forwarded in the Authorization header
 */
export function createRlsClientFromRequest(req: Request): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  const auth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const [scheme, token] = auth.split(' ');
  const bearer = scheme?.toLowerCase() === 'bearer' && token ? token : undefined;

  const client = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, detectSessionInUrl: false },
    global: bearer
      ? { headers: { Authorization: `Bearer ${bearer}` } }
      : undefined,
  });
  return client;
}

export function getClientOrThrow(req: Request): SupabaseClient {
  const client = createRlsClientFromRequest(req);
  if (!client) throw new Error('Server is misconfigured: missing SUPABASE_URL or SUPABASE_ANON_KEY');
  return client;
}
