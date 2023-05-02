import { z } from 'zod';

import { isAvailableModel } from '@/data/open-ai';
import { TONES } from '@/data/tones';

export const ZGenerateCoverLetterRequest = z.object({
  summarisedResume: z.string().min(1),
  summarisedJobDescription: z.string().min(1),
  tone: z.enum(TONES),
  model: z
    .string()
    .refine((model) => isAvailableModel(model), {
      message: 'Invalid model provided',
    })
    .optional(),
  secretKey: z.string().min(1).optional(),
});

export type TGenerateCoverLetterRequest = z.infer<typeof ZGenerateCoverLetterRequest>;

export const ZGenerateCoverLetterResponse = z
  .object({
    coverLetter: z.string(),
  })
  .or(z.object({ error: z.string() }));

export type TGenerateCoverLetterResponse = z.infer<typeof ZGenerateCoverLetterResponse>;
