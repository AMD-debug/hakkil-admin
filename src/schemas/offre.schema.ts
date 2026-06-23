import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

const localizedOptional = z.object({
  fr: z.string(),
  en: z.string(),
});

export const offreSchema = z.object({
  title: localized,
  description: localized,
  longDescription: localizedOptional.optional(),
  category: z.string().min(1, 'Requis'),
  slug: z
    .string()
    .min(1, 'Requis')
    .regex(/^[a-z0-9-]+$/, 'Lettres minuscules, chiffres et tirets'),
  price: z.string().min(1, 'Requis'),
  features: z.object({
    fr: z.array(z.string()),
    en: z.array(z.string()),
  }),
  images: z.array(z.string().url()),
  highlighted: z.boolean(),
  order: z.number().int().min(0),
  published: z.boolean(),
});

export type OffreInput = z.infer<typeof offreSchema>;
