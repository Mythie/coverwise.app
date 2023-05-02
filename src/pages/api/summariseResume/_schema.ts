import { z } from 'zod';

import { isAvailableModel } from '@/data/open-ai';

export const ZSummariseResumeRequest = z.object({
  resume: z.string().min(1),
  model: z
    .string()
    .refine((model) => isAvailableModel(model), {
      message: 'Invalid model provided',
    })
    .optional(),
  apiKey: z.string().min(1).optional(),
});

export type TSummariseResumeRequest = z.infer<typeof ZSummariseResumeRequest>;

export const ZSummariseResumeResponse = z
  .object({
    summarisedResume: z.string(),
  })
  .or(z.object({ error: z.string() }));

export type TSummariseResumeResponse = z.infer<typeof ZSummariseResumeResponse>;
