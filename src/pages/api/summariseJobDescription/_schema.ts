import { z } from 'zod';

import { isAvailableModel } from '@/data/open-ai';

export const ZSummariseJobDescriptionRequest = z.object({
  jobDescription: z.string().min(1),
  model: z
    .string()
    .refine((model) => isAvailableModel(model), {
      message: 'Invalid model provided',
    })
    .optional(),
  secretKey: z.string().min(1).optional(),
});

export type TSummariseJobDescriptionRequest = z.infer<typeof ZSummariseJobDescriptionRequest>;

export const ZSummariseJobDescriptionResponse = z
  .object({
    summarisedJobDescription: z.string(),
  })
  .or(z.object({ error: z.string() }));

export type TSummariseJobDescriptionResponse = z.infer<typeof ZSummariseJobDescriptionResponse>;
