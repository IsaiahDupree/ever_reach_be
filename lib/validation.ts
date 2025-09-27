import { z } from "zod";

export const craftMessageSchema = z.object({
  tone: z.string().optional(),
  purpose: z.string().min(1),
  context: z.string().optional(),
  to: z
    .object({ name: z.string().optional(), email: z.string().email().optional() })
    .optional(),
});

export type CraftMessageInput = z.infer<typeof craftMessageSchema>;

export const uploadSignSchema = z.object({
  path: z.string().min(1),
  contentType: z.string().min(1).optional(),
});

export type UploadSignInput = z.infer<typeof uploadSignSchema>;
