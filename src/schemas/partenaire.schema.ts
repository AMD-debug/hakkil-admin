import { z } from 'zod';

export const partenaireSchema = z.object({
  name: z.string().min(1, 'Requis'),
  logo: z.string().url('Logo requis'),
  url: z.union([z.string().url(), z.literal('')]).optional(),
  order: z.number().int().min(0),
});

export type PartenaireInput = z.infer<typeof partenaireSchema>;
