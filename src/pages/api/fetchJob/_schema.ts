import { z } from 'zod';

import { JOB_BOARD_KEYS } from '@/data/job-boards';

export const ZFetchJobRequest = z.object({
  url: z.string(),
  jobBoard: z.enum(JOB_BOARD_KEYS),
});

export type TFetchJobRequest = z.infer<typeof ZFetchJobRequest>;

export const ZFetchJobResponse = z
  .object({
    textContent: z.string(),
  })
  .or(z.object({ error: z.string() }));

export type TFetchJobResponse = z.infer<typeof ZFetchJobResponse>;
