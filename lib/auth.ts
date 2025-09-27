import 'server-only';

export type User = { id: string } | null;

export async function getUser(req: Request): Promise<User> {
  // Minimal placeholder: parse Bearer token but do not verify
  // In production, verify JWT or session and return user data
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) return null;
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  // TODO: verify token (e.g., JWT) and extract user ID
  return { id: 'anonymous' };
}
