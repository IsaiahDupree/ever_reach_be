import { createClient } from "@supabase/supabase-js";
import { ok, options, badRequest, serverError } from "@/lib/cors";
import { uploadSignSchema } from "@/lib/validation";

export const runtime = 'nodejs';

export async function OPTIONS(){ return options(); }

export async function POST(req: Request){
  try {
    const body = await req.json();
    const parsed = uploadSignSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.message);
    }
    const { path, contentType } = parsed.data;

    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media-assets';
    if (!url || !serviceKey) {
      return serverError('Supabase server env vars not configured');
    }

    const supa = createClient(url, serviceKey);
    // createSignedUploadUrl does not accept contentType; client will set it when uploading
    const { data, error } = await supa.storage.from(bucket).createSignedUploadUrl(path, {
      upsert: true,
    } as any);
    if (error) return serverError(error.message);

    return ok({ url: data.signedUrl, path, contentType: contentType || 'application/octet-stream' });
  } catch (err: any) {
    return serverError(err?.message || 'Internal error');
  }
}
