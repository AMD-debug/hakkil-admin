import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

export const temoignageSchema = z.object({
  clientName: z.string().min(1, 'Requis'),
  company: z.string().optional(),
  content: localized,
  rating: z.number().int().min(1, 'Note requise').max(5),
  approved: z.boolean(),
});

export type TemoignageInput = z.infer<typeof temoignageSchema>;
