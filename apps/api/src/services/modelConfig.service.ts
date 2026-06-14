import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

export type ModelProvider = 'openai' | 'openai_compatible' | 'volcengine_ark';
export type ModelApiMode = 'responses' | 'chat_completions';

export const VOLCENGINE_ARK_DEFAULTS = {
  baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
  model: 'doubao-seed-2-0-pro-260215',
  apiMode: 'responses' as const,
};

export type ModelConfigUpdate = {
  enabled: boolean;
  provider: ModelProvider;
  apiMode: ModelApiMode;
  baseUrl: string;
  model: string;
  apiKey?: string;
  clearApiKey?: boolean;
};

type RuntimeModelConfig = {
  enabled: boolean;
  provider: ModelProvider;
  apiMode: ModelApiMode;
  baseUrl: string;
  model: string;
  apiKey: string | null;
  source: 'environment' | 'runtime';
};

const runtimeStorePath = path.resolve(process.cwd(), '../../data/runtime-model.local.json');

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, '');

const resolveInitialProvider = (): ModelProvider => {
  if (env.llm.provider === 'openai_compatible') return 'openai_compatible';
  if (env.llm.provider === 'volcengine_ark') return 'volcengine_ark';
  return 'openai';
};

const resolveInitialApiMode = (provider: ModelProvider): ModelApiMode => {
  if (env.llm.apiMode === 'chat_completions') return 'chat_completions';
  if (env.llm.apiMode === 'responses') return 'responses';
  if (provider === 'volcengine_ark' || provider === 'openai') return 'responses';
  return 'chat_completions';
};

const resolveInitialBaseUrl = (provider: ModelProvider) => {
  if (env.llm.baseUrl) return normalizeBaseUrl(env.llm.baseUrl);
  if (provider === 'volcengine_ark') return VOLCENGINE_ARK_DEFAULTS.baseUrl;
  return 'https://api.openai.com/v1';
};

const resolveInitialModel = (provider: ModelProvider) => {
  if (env.llm.model) return env.llm.model;
  if (provider === 'volcengine_ark') return VOLCENGINE_ARK_DEFAULTS.model;
  return 'gpt-5.4-mini';
};

const buildEnvRuntimeConfig = (): RuntimeModelConfig => {
  const provider = resolveInitialProvider();
  return {
    enabled: env.llm.enabled,
    provider,
    apiMode: resolveInitialApiMode(provider),
    baseUrl: resolveInitialBaseUrl(provider),
    model: resolveInitialModel(provider),
    apiKey: env.llm.apiKey,
    source: 'environment',
  };
};

const loadPersistedRuntimeConfig = (): RuntimeModelConfig | null => {
  if (!env.allowRuntimeModelConfig || !fs.existsSync(runtimeStorePath)) {
    return null;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(runtimeStorePath, 'utf-8')) as Partial<RuntimeModelConfig>;
    if (!raw.baseUrl || !raw.model || !raw.provider || !raw.apiMode) {
      return null;
    }

    return {
      enabled: raw.enabled ?? true,
      provider: raw.provider,
      apiMode: raw.apiMode,
      baseUrl: normalizeBaseUrl(raw.baseUrl),
      model: raw.model.trim(),
      apiKey: raw.apiKey ?? null,
      source: 'runtime',
    };
  } catch {
    return null;
  }
};

const persistRuntimeConfig = (config: RuntimeModelConfig) => {
  if (!env.allowRuntimeModelConfig) return;

  try {
    fs.mkdirSync(path.dirname(runtimeStorePath), { recursive: true });
    fs.writeFileSync(
      runtimeStorePath,
      JSON.stringify(
        {
          enabled: config.enabled,
          provider: config.provider,
          apiMode: config.apiMode,
          baseUrl: config.baseUrl,
          model: config.model,
          apiKey: config.apiKey,
        },
        null,
        2,
      ),
      'utf-8',
    );
  } catch (error) {
    throw new ApiError(
      500,
      'model_config_persist_failed',
      `模型配置保存失败：${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

let runtimeConfig: RuntimeModelConfig = loadPersistedRuntimeConfig() ?? buildEnvRuntimeConfig();

export const isModelTestable = () =>
  Boolean(runtimeConfig.baseUrl && runtimeConfig.model && runtimeConfig.apiKey);

export const isModelConfigured = () =>
  Boolean(runtimeConfig.enabled && isModelTestable());

export const getModelClientConfig = () => ({ ...runtimeConfig });

export const getPublicModelConfig = () => ({
  enabled: runtimeConfig.enabled,
  configured: isModelConfigured(),
  testable: isModelTestable(),
  status: isModelConfigured() ? 'configured' : 'not_configured',
  provider: runtimeConfig.provider,
  apiMode: runtimeConfig.apiMode,
  baseUrl: runtimeConfig.baseUrl,
  model: runtimeConfig.model,
  hasApiKey: Boolean(runtimeConfig.apiKey),
  apiKeyPreview: runtimeConfig.apiKey
    ? `${runtimeConfig.apiKey.slice(0, 3)}***${runtimeConfig.apiKey.slice(-2)}`
    : null,
  source: runtimeConfig.source,
  runtimeConfigAllowed: env.allowRuntimeModelConfig,
});

export const updateModelConfig = (input: ModelConfigUpdate) => {
  if (!env.allowRuntimeModelConfig) {
    throw new ApiError(
      403,
      'runtime_model_config_disabled',
      '生产环境已禁用页面写入模型配置，请通过服务端环境变量配置。',
    );
  }

  const parsedUrl = (() => {
    try {
      return new URL(input.baseUrl);
    } catch {
      throw new ApiError(422, 'invalid_model_base_url', '模型地址格式无效。');
    }
  })();
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new ApiError(422, 'invalid_model_base_url', '模型地址仅支持 HTTP 或 HTTPS。');
  }

  const nextApiKey = input.clearApiKey
    ? null
    : input.apiKey?.trim() || runtimeConfig.apiKey;

  if (!nextApiKey) {
    throw new ApiError(422, 'model_api_key_required', '请填写 API Key 后再保存。');
  }

  const apiMode: ModelApiMode =
    input.provider === 'volcengine_ark'
      ? 'responses'
      : input.provider === 'openai_compatible' && input.apiMode === 'responses'
        ? 'chat_completions'
        : input.apiMode;

  runtimeConfig = {
    enabled: input.enabled,
    provider: input.provider,
    apiMode,
    baseUrl: normalizeBaseUrl(input.baseUrl),
    model: input.model.trim(),
    apiKey: nextApiKey,
    source: 'runtime',
  };

  persistRuntimeConfig(runtimeConfig);

  return getPublicModelConfig();
};
