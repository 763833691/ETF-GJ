import dotenv from 'dotenv';

const isProduction = (process.env.NODE_ENV ?? 'development') === 'production';

dotenv.config({ path: '../../.env', override: !isProduction });
dotenv.config({ override: !isProduction });

const readBoolean = (value: string | undefined, fallback = false) => {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
};

const readNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiHost: process.env.API_HOST ?? '127.0.0.1',
  apiPort: readNumber(process.env.API_PORT, 8000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://127.0.0.1:5173',
  dataSourceMode: process.env.DATA_SOURCE_MODE ?? 'demo_seed',
  enableProviderApi: readBoolean(process.env.ENABLE_PROVIDER_API, false),
  demoFallbackEnabled: readBoolean(process.env.DEMO_FALLBACK_ENABLED, true),
  requestTimeoutMs: readNumber(process.env.REQUEST_TIMEOUT_MS, 30000),
  llmRequestTimeoutMs: readNumber(
    process.env.LLM_REQUEST_TIMEOUT_MS,
    readNumber(process.env.REQUEST_TIMEOUT_MS, 120000),
  ),
  allowRuntimeModelConfig:
    !isProduction ||
    readBoolean(process.env.ALLOW_RUNTIME_MODEL_CONFIG, false),
  llm: {
    enabled: readBoolean(process.env.LLM_ENABLED, !isProduction),
    provider: process.env.LLM_PROVIDER || null,
    apiMode: process.env.LLM_API_MODE || null,
    baseUrl: process.env.LLM_BASE_URL || null,
    apiKey: process.env.LLM_API_KEY || null,
    model: process.env.LLM_MODEL || null,
  },
};
