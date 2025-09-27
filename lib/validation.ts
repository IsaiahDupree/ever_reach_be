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

// Contacts
export const contactCreateSchema = z.object({
  display_name: z.string().min(1, 'display_name is required').max(120),
  emails: z.array(z.string().email()).max(10).optional(),
  phones: z.array(z.string().min(3).max(40)).max(10).optional(),
  company: z.string().max(120).optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().min(1).max(40)).max(50).optional(),
  avatar_url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export type ContactCreateInput = z.infer<typeof contactCreateSchema>;

export const contactUpdateSchema = z.object({
  display_name: z.string().min(1).max(120).optional(),
  emails: z.array(z.string().email()).max(10).optional(),
  phones: z.array(z.string().min(3).max(40)).max(10).optional(),
  company: z.string().max(120).optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().min(1).max(40)).max(50).optional(),
  avatar_url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
}).refine(obj => Object.keys(obj).length > 0, { message: 'At least one field must be provided' });

export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
