import { z } from 'zod';

export const planGenerateSchema = z.object({
  profileId: z.string().optional(),
  goalText: z.string().optional(),
  useModel: z.boolean().optional().default(true),
});
