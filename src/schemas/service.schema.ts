import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

const localizedOptional = z.object({
  fr: z.string(),
  en: z.string(),
});

export const serviceSchema = z.object({
  title: localized,
  description: localized,
  longDescription: localizedOptional.optional(),
  icon: z.string().min(1, 'Requis'),
  slug: z
    .string()
    .min(1, 'Requis')
    .regex(/^[a-z0-9-]+$/, 'Lettres minuscules, chiffres et tirets uniquement'),
  order: z.number().int().min(0),
  published: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
