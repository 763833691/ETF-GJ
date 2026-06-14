import { z } from 'zod';

export const scenarioSimulateSchema = z.object({
  scenarioType: z.string().min(1),
  profileId: z.string().optional(),
  planId: z.string().optional(),
});
