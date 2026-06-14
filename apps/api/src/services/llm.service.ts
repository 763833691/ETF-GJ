import { z } from 'zod';
import { env } from '../config/env';
import type { WorkspaceGenerateInput } from '../schemas/workspace.schema';
import { ApiError } from '../utils/ApiError';
import {
  getModelClientConfig,
  getPublicModelConfig,
  isModelConfigured,
  isModelTestable,
} from './modelConfig.service';

const modelProfileSchema = z.object({
  investmentGoal: z.string(),
  riskPreference: z.enum(['low', 'medium', 'high']),
  riskLabel: z.string(),
  experienceLevel: z.string(),
  knowledgeLevel: z.string(),
  themePreferences: z.array(z.string()).max(8),
  riskFocus: z.array(z.string()).max(8),
  planGoal: z.string(),
});

const modelPlanSchema = z.object({
  title: z.string(),
  matchScore: z.number().min(0).max(100),
  scoreLabel: z.string(),
  suitableFor: z.string(),
  logic: z.string(),
  etfTypes: z.array(z.string()).max(6),
  risks: z.array(z.string()).max(8),
  evidenceIds: z.array(z.string()).max(8),
});

const modelNodeSchema = z.object({
  key: z.string(),
  objectType: z.string(),
  category: z.enum(['user', 'asset', 'metric', 'event', 'risk', 'evidence', 'strategy']),
  title: z.string(),
  subtitle: z.string(),
  summary: z.string(),
  confidence: z.number().min(0).max(1),
  riskLevel: z.enum(['low', 'medium', 'high']).nullable(),
});

const modelEdgeSchema = z.object({
  sourceRef: z.string(),
  targetRef: z.string(),
  label: z.string(),
  relationType: z.string(),
  confidence: z.number().min(0).max(1),
});

const workspaceModelOutputSchema = z.object({
  analysisSummary: z.string(),
  profile: modelProfileSchema,
  plans: z.array(modelPlanSchema).min(1).max(3),
  nodes: z.array(modelNodeSchema).min(3).max(8),
  edges: z.array(modelEdgeSchema).min(2).max(12),
});

const testOutputSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
});

const WORKSPACE_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['analysisSummary', 'profile', 'plans', 'nodes', 'edges'],
  properties: {
    analysisSummary: { type: 'string' },
    profile: {
      type: 'object',
      additionalProperties: false,
      required: [
        'investmentGoal',
        'riskPreference',
        'riskLabel',
        'experienceLevel',
        'knowledgeLevel',
        'themePreferences',
        'riskFocus',
        'planGoal',
      ],
      properties: {
        investmentGoal: { type: 'string' },
        riskPreference: { type: 'string', enum: ['low', 'medium', 'high'] },
        riskLabel: { type: 'string' },
        experienceLevel: { type: 'string' },
        knowledgeLevel: { type: 'string' },
        themePreferences: { type: 'array', items: { type: 'string' }, maxItems: 8 },
        riskFocus: { type: 'array', items: { type: 'string' }, maxItems: 8 },
        planGoal: { type: 'string' },
      },
    },
    plans: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'title',
          'matchScore',
          'scoreLabel',
          'suitableFor',
          'logic',
          'etfTypes',
          'risks',
          'evidenceIds',
        ],
        properties: {
          title: { type: 'string' },
          matchScore: { type: 'number', minimum: 0, maximum: 100 },
          scoreLabel: { type: 'string' },
          suitableFor: { type: 'string' },
          logic: { type: 'string' },
          etfTypes: { type: 'array', items: { type: 'string' }, maxItems: 6 },
          risks: { type: 'array', items: { type: 'string' }, maxItems: 8 },
          evidenceIds: { type: 'array', items: { type: 'string' }, maxItems: 8 },
        },
      },
    },
    nodes: {
      type: 'array',
      minItems: 3,
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'key',
          'objectType',
          'category',
          'title',
          'subtitle',
          'summary',
          'confidence',
          'riskLevel',
        ],
        properties: {
          key: { type: 'string' },
          objectType: { type: 'string' },
          category: {
            type: 'string',
            enum: ['user', 'asset', 'metric', 'event', 'risk', 'evidence', 'strategy'],
          },
          title: { type: 'string' },
          subtitle: { type: 'string' },
          summary: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          riskLevel: { type: ['string', 'null'], enum: ['low', 'medium', 'high', null] },
        },
      },
    },
    edges: {
      type: 'array',
      minItems: 2,
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['sourceRef', 'targetRef', 'label', 'relationType', 'confidence'],
        properties: {
          sourceRef: { type: 'string' },
          targetRef: { type: 'string' },
          label: { type: 'string' },
          relationType: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
    },
  },
};

const TEST_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ok', 'message'],
  properties: {
    ok: { type: 'boolean' },
    message: { type: 'string' },
  },
};

const SYSTEM_PROMPT = `你是 ETF 投资教育平台的语义分析模型。
你的任务是分析用户学习目标，生成用户画像、投教方案以及可视化语义节点和关系。
必须遵守：
1. 只做投资教育与风险解释，不给出买入、卖出、收益承诺或仓位指令。
2. 不虚构实时行情、新闻或基金业绩。未提供的数据不得写成事实。
3. 方案必须解释风险、适用人群和学习路径。
4. 节点与关系要围绕用户输入动态生成，标题简洁，适合放在画布卡片中。
5. 仅输出符合指定 JSON 结构的内容。`;

const parseJsonText = (value: string) => {
  const trimmed = value.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced?.[1] ?? trimmed) as unknown;
};

const extractResponsesText = (payload: any): string | null => {
  if (typeof payload?.output_text === 'string') return payload.output_text;

  for (const output of payload?.output ?? []) {
    for (const content of output?.content ?? []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') {
        return content.text;
      }
      if (typeof content?.text === 'string' && content.text.trim()) {
        return content.text;
      }
    }
  }

  const messageContent = payload?.choices?.[0]?.message?.content;
  if (typeof messageContent === 'string') return messageContent;

  return null;
};

const performRequest = async (url: string, body: unknown, timeoutMs = env.llmRequestTimeoutMs) => {
  const config = getModelClientConfig();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const providerMessage =
        payload?.error?.message || payload?.message || `HTTP ${response.status}`;
      throw new ApiError(
        502,
        'model_request_failed',
        `模型服务调用失败：${providerMessage}`,
        { status: response.status },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new ApiError(
        504,
        'model_request_timeout',
        `模型服务响应超时（${Math.round(timeoutMs / 1000)} 秒），请稍后重试。`,
      );
    }

    throw new ApiError(
      502,
      'model_request_failed',
      `模型服务连接失败：${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

type StructuredModelOptions = {
  requireEnabled?: boolean;
  timeoutMs?: number;
};

const callStructuredModel = async <T>(
  name: string,
  schema: Record<string, unknown>,
  prompt: string,
  parser: z.ZodType<T>,
  options: StructuredModelOptions = {},
): Promise<T> => {
  const requireEnabled = options.requireEnabled ?? true;
  const timeoutMs = options.timeoutMs ?? env.llmRequestTimeoutMs;
  const ready = requireEnabled ? isModelConfigured() : isModelTestable();
  if (!ready) {
    throw new ApiError(
      503,
      'model_not_configured',
      requireEnabled
        ? '请先在模型配置页面完成模型设置。'
        : '请先填写并保存 Base URL、模型名称和 API Key。',
    );
  }

  const config = getModelClientConfig();
  let text: string | null = null;

  if (config.apiMode === 'responses') {
    const payload = await performRequest(
      `${config.baseUrl}/responses`,
      {
        model: config.model,
        input: [
          {
            role: 'system',
            content: [{ type: 'input_text', text: SYSTEM_PROMPT }],
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: prompt }],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name,
            strict: true,
            schema,
          },
        },
      },
      timeoutMs,
    );
    text = extractResponsesText(payload);
  } else {
    const payload = await performRequest(
      `${config.baseUrl}/chat/completions`,
      {
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      },
      timeoutMs,
    );
    text = payload?.choices?.[0]?.message?.content ?? null;
  }

  if (!text) {
    throw new ApiError(502, 'model_empty_response', '模型返回了空内容。');
  }

  try {
    return parser.parse(parseJsonText(text));
  } catch (error) {
    throw new ApiError(502, 'model_invalid_response', '模型返回内容不符合约定结构。', {
      reason: error instanceof Error ? error.message : String(error),
    });
  }
};

const safeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 36) || 'node';

export const testModelConnection = async () => {
  const result = await callStructuredModel(
    'etf_model_connection_test',
    TEST_JSON_SCHEMA,
    '请返回 {"ok": true, "message": "模型连接正常"}，不要添加其他内容。',
    testOutputSchema,
    { requireEnabled: false, timeoutMs: 60000 },
  );

  return {
    ...result,
    config: getPublicModelConfig(),
  };
};

export const generateWorkspaceWithModel = async (
  input: WorkspaceGenerateInput,
  context: {
    existingNodes: Array<{ id: string; title?: unknown; category?: unknown }>;
    evidenceIds: string[];
    disclaimer: string;
  },
) => {
  const prompt = `请根据以下用户输入生成 ETF 投资图谱：
${JSON.stringify(input, null, 2)}

可以连接的现有画布节点：
${JSON.stringify(context.existingNodes.slice(0, 40), null, 2)}

方案 evidenceIds 只能从以下 ID 中选择：
${JSON.stringify(context.evidenceIds)}

节点 edges 的 sourceRef/targetRef 可以引用本次 nodes 的 key，也可以引用上面的现有节点 id。
至少生成用户目标、风险画像、方案路径三类节点，并让关系能够解释用户输入如何影响方案。`;

  const output = await callStructuredModel(
    'etf_workspace_generation',
    WORKSPACE_JSON_SCHEMA,
    prompt,
    workspaceModelOutputSchema,
  );

  const runId = Date.now().toString(36);
  const keyToId = new Map<string, string>();
  const existingIds = new Set(context.existingNodes.map((node) => node.id));

  const nodes = output.nodes.map((node, index) => {
    const id = `model_${safeKey(node.key)}_${runId}_${index}`;
    keyToId.set(node.key, id);
    return {
      id,
      type: 'semanticNode' as const,
      position: { x: 0, y: 0 },
      data: {
        objectType: node.objectType,
        category: node.category,
        title: node.title,
        subtitle: node.subtitle,
        summary: node.summary,
        status: node.riskLevel === 'high' ? 'warning' : 'active',
        confidence: node.confidence,
        riskLevel: node.riskLevel ?? undefined,
        dataSource: 'model_generated' as const,
        sourceSystem: 'semantic_world' as const,
        updatedAt: new Date().toISOString(),
      },
    };
  });

  const resolveRef = (ref: string) =>
    keyToId.get(ref) || (existingIds.has(ref) ? ref : null);

  const edges = output.edges.flatMap((edge, index) => {
    const source = resolveRef(edge.sourceRef);
    const target = resolveRef(edge.targetRef);
    if (!source || !target || source === target) return [];

    return [
      {
        id: `model_edge_${runId}_${index}`,
        source,
        target,
        label: edge.label,
        relationType: edge.relationType,
        animated: index < 3,
        data: {
          dataSource: 'model_generated' as const,
          confidence: edge.confidence,
          explanation: output.analysisSummary,
        },
      },
    ];
  });

  const profileId = `profile_model_${runId}`;
  const profile = {
    id: profileId,
    objectType: 'investor_profile',
    naturalLanguageGoal: input.naturalLanguageGoal,
    monthlyBudget: input.monthlyBudget ?? 0,
    timeHorizon: input.investmentHorizon ?? '未明确',
    dataSource: 'model_generated' as const,
    ...output.profile,
  };

  const plans = output.plans.map((plan, index) => ({
    id: `plan_model_${runId}_${index}`,
    ...plan,
    disclaimer: context.disclaimer,
    dataSource: 'model_generated' as const,
  }));

  return {
    profile,
    plans,
    graphPatch: {
      nodes,
      edges,
      highlightNodeIds: nodes.map((node) => node.id),
      highlightEdgeIds: edges.map((edge) => edge.id),
    },
    analysisSummary: output.analysisSummary,
    model: {
      status: 'configured',
      provider: getModelClientConfig().provider,
      model: getModelClientConfig().model,
    },
    dataSource: 'model_generated',
  };
};
