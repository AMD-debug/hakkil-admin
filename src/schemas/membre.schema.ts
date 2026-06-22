import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

const optionalUrl = z.union([z.string().url(), z.literal('')]).optional();

export const membreSchema = z.object({
  name: z.string().min(1, 'Requis'),
  role: localized,
  photo: z.string().url('Photo requise'),
  bio: localized,
  linkedin: optionalUrl,
  github: optionalUrl,
  facebook: optionalUrl,
  whatsapp: z.string().optional(), // numéro ou lien wa.me
  order: z.number().int().min(0),
});

export type MembreInput = z.infer<typeof membreSchema>;
