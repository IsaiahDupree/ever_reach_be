import 'server-only';
import { createClient } from '@supabase/supabase-js';

export type User = { id: string; email?: string | null } | null;

/**
 * Verifies a Supabase JWT (from Authorization: Bearer <jwt>) using supabase-js.
 * Returns a minimal user object { id, email? } or null if invalid/missing.
 */
export async function getUser(req: Request): Promise<User> {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) return null;
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;

  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  try {
    const supa = createClient(url, anon);
    const { data, error } = await supa.auth.getUser(token);
    if (error || !data?.user) return null;
    return { id: data.user.id, email: data.user.email };
  } catch {
    return null;
  }
}
