import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

// Le contenu HTML : on rejette le document vide de TipTap ("<p></p>").
const htmlNotEmpty = (v: string) => v.replace(/<[^>]*>/g, '').trim().length > 0;
const localizedHtml = z.object({
  fr: z.string().refine(htmlNotEmpty, 'Requis'),
  en: z.string().refine(htmlNotEmpty, 'Requis'),
});

export const articleSchema = z.object({
  title: localized,
  excerpt: localized,
  content: localizedHtml,
  coverImage: z.string().url('Image de couverture requise'),
  slug: z
    .string()
    .min(1, 'Requis')
    .regex(/^[a-z0-9-]+$/, 'Lettres minuscules, chiffres et tirets'),
  author: z.string().min(1, 'Requis'),
  tags: z.array(z.string()),
  published: z.boolean(),
});

export type ArticleInput = z.infer<typeof articleSchema>;
