import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

export const offreSchema = z.object({
  title: localized,
  description: localized,
  price: z.string().min(1, 'Requis'),
  features: z.object({
    fr: z.array(z.string()),
    en: z.array(z.string()),
  }),
  highlighted: z.boolean(),
  order: z.number().int().min(0),
  published: z.boolean(),
});

export type OffreInput = z.infer<typeof offreSchema>;
