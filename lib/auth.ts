import 'server-only';
import { createClient } from '@supabase/supabase-js';

export type User = { id: string } | null;

export async function getUser(req: Request): Promise<User> {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) return null;
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    // Misconfigured server env; treat as unauthenticated
    return null;
  }

  // Server client (service role) can verify a user token via getUser(access_token)
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return { id: data.user.id };
  } catch {
    return null;
  }
}
