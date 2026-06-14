import { z } from 'zod';

export const profileParseSchema = z.object({
  naturalLanguageGoal: z.string().min(1).max(1000),
  riskPreference: z.string().optional(),
  monthlyBudget: z.number().positive().optional(),
  investmentHorizon: z.string().optional(),
  themePreferences: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
});
