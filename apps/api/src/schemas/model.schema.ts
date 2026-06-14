import { z } from 'zod';

export const modelConfigUpdateSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(['openai', 'openai_compatible', 'volcengine_ark']),
  apiMode: z.enum(['responses', 'chat_completions']),
  baseUrl: z.string().url(),
  model: z.string().min(1).max(120),
  apiKey: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().min(1).max(500).optional(),
  ),
  clearApiKey: z.boolean().optional().default(false),
});
