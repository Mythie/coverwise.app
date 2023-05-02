import { z } from 'zod';

export const ZResumeSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  textContent: z.string(),
});

export type TResumeSchema = z.infer<typeof ZResumeSchema>;
