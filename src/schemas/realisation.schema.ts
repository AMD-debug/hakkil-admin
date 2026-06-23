import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

export const realisationSchema = z
  .object({
    title: localized,
    description: localized,
    category: z.string().min(1, 'Requis'),
    slug: z
      .string()
      .min(1, 'Requis')
      .regex(/^[a-z0-9-]+$/, 'Lettres minuscules, chiffres et tirets'),
    images: z.array(z.string().url()).min(1, 'Au moins une image'),
    coverImage: z.string().url('Choisissez une image de couverture'),
    clientName: z.string().optional(),
    liveUrl: z.union([z.string().url(), z.literal('')]).optional(),
    tags: z.array(z.string()),
    published: z.boolean(),
  })
  .refine((d) => d.images.includes(d.coverImage), {
    message: 'La couverture doit faire partie des images',
    path: ['coverImage'],
  });

export type RealisationInput = z.infer<typeof realisationSchema>;
