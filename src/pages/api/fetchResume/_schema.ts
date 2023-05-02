import { z } from 'zod';

import { isAcceptedFileExtension } from '@/data/resume';

export const ZFetchResumeTextRequest = z.object({
  fileName: z.string().min(1),
  fileExtension: z
    .string()
    .min(1)
    .refine((value) => isAcceptedFileExtension(value), {
      message: 'Invalid extension',
    }),
  binaryData: z.string().min(1),
});

export type TFetchResumeTextRequest = z.infer<typeof ZFetchResumeTextRequest>;

export const ZFetchResumeTextResponse = z
  .object({
    textContent: z.string(),
  })
  .or(z.object({ error: z.string() }));

export type TFetchResumeTextResponse = z.infer<typeof ZFetchResumeTextResponse>;
