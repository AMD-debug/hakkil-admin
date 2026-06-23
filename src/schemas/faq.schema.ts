import { z } from 'zod';

const localized = z.object({
  fr: z.string().min(1, 'Requis'),
  en: z.string().min(1, 'Requis'),
});

export const faqSchema = z.object({
  question: localized,
  answer: localized,
  order: z.number().int().min(0),
  published: z.boolean(),
});

export type FaqInput = z.infer<typeof faqSchema>;
