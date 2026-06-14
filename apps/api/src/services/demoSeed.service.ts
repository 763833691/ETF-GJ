import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { isModelConfigured } from './modelConfig.service';

type DemoSeed = {
  app: Record<string, unknown>;
  disclaimer: string;
  defaultProject: Record<string, unknown>;
  dataStatus: Record<string, unknown>;
  profile: Record<string, unknown>;
  semanticGraph: {
    nodes: Array<Record<string, unknown> & { data?: Record<string, unknown> }>;
    edges: Array<Record<string, unknown> & { data?: Record<string, unknown> }>;
  };
  newsEvents: Array<Record<string, unknown>>;
  riskSignals: Array<Record<string, unknown>>;
  evidenceObjects: Array<Record<string, unknown>>;
  strategyPlans: Array<Record<string, unknown>>;
  scenarios: Array<Record<string, unknown> & { scenarioType: string }>;
  actionLogs: Array<Record<string, unknown>>;
};

const seedPath = path.resolve(process.cwd(), '../../data/demoSeed.json');

const readSeed = (): DemoSeed => {
  const raw = fs.readFileSync(seedPath, 'utf-8');
  return JSON.parse(raw) as DemoSeed;
};

const seed = readSeed();

const graphStats = () => ({
  objectCount: seed.semanticGraph.nodes.length,
  relationCount: seed.semanticGraph.edges.length,
  evidenceCount: seed.evidenceObjects.length,
  riskSignalCount: seed.riskSignals.length,
  newsEventCount: seed.newsEvents.length,
});

export const getModelGenerationContext = () => ({
  existingNodes: seed.semanticGraph.nodes.map((node) => ({
    id: String(node.id),
    title: node.data?.title,
    category: node.data?.category,
  })),
  evidenceIds: seed.evidenceObjects.map((item) => String(item.id)),
  disclaimer: seed.disclaimer,
});

export const getHealth = () => ({
  status: 'ok',
  service: 'etf-swm-agent-api',
  version: '0.1.0',
  time: new Date().toISOString(),
  dataSource: 'demo_seed',
});

export const getBootstrap = () => ({
  app: seed.app,
  defaultProject: seed.defaultProject,
  dataStatus: {
    ...seed.dataStatus,
    modelStatus: isModelConfigured() ? 'configured' : 'not_configured',
  },
  graphStats: graphStats(),
  profile: seed.profile,
  plans: seed.strategyPlans,
  newsEvents: seed.newsEvents.slice(0, 4),
  riskSignals: seed.riskSignals,
  evidenceObjects: seed.evidenceObjects.slice(0, 6),
  disclaimer: seed.disclaimer,
  dataSource: 'demo_seed',
});

export const getSemanticGraph = () => ({
  nodes: seed.semanticGraph.nodes,
  edges: seed.semanticGraph.edges,
  stats: graphStats(),
  dataStatus: {
    ...seed.dataStatus,
    dataSource: 'demo_seed',
    providerApiEnabled: env.enableProviderApi,
  },
});

export const parseProfile = (input: {
  naturalLanguageGoal: string;
  riskPreference?: string;
  monthlyBudget?: number;
  investmentHorizon?: string;
  themePreferences?: string[];
  experienceLevel?: string;
}) => ({
  profile: {
    ...seed.profile,
    naturalLanguageGoal: input.naturalLanguageGoal,
    monthlyBudget: input.monthlyBudget ?? seed.profile.monthlyBudget,
    timeHorizon: input.investmentHorizon ?? seed.profile.timeHorizon,
    riskPreference: input.riskPreference ?? seed.profile.riskPreference,
    themePreferences: input.themePreferences ?? seed.profile.themePreferences,
    experienceLevel: input.experienceLevel ?? seed.profile.experienceLevel,
    dataSource: 'demo_seed',
  },
  semanticObjectsCreated: ['profile_demo_001', 'goal_demo_001', 'risk_profile_demo_001'],
  actionLog: {
    id: `action_parse_${Date.now()}`,
    actionType: 'parse_profile',
    title: '基于输入生成用户画像',
    status: 'completed',
    dataSource: 'demo_seed',
  },
});

export const generatePlan = (useModel = true) => {
  if (useModel && !isModelConfigured()) {
    throw new ApiError(
      503,
      'model_not_configured',
      '当前未配置模型服务，无法生成真实 AI 投教方案。可查看演示方案。',
      { dataSource: 'demo_seed', modelStatus: 'not_configured' },
    );
  }

  return {
    plans: seed.strategyPlans.map((plan) => ({
      ...plan,
      disclaimer: seed.disclaimer,
      dataSource: 'demo_seed',
    })),
    model: {
      enabled: isModelConfigured(),
      status: isModelConfigured() ? 'configured' : 'not_configured',
    },
    dataSource: 'demo_seed',
  };
};

export const simulateScenario = (scenarioType: string) => {
  const scenario = seed.scenarios.find((item) => item.scenarioType === scenarioType);
  if (!scenario) {
    throw new ApiError(404, 'not_found', '未找到对应场景推演结果。', { scenarioType });
  }

  return {
    scenarioRun: {
      ...scenario,
      id: `scenario_run_${scenario.scenarioType}`,
      disclaimer: seed.disclaimer,
    },
    graphPatch: {
      highlightNodeIds: scenario.highlightNodeIds ?? [],
      highlightEdgeIds: scenario.highlightEdgeIds ?? [],
    },
    dataSource: 'demo_seed',
  };
};

export const getReport = () => ({
  report: {
    id: 'report_demo_001',
    title: 'ETF 智能投教辅助报告',
    generatedAt: new Date().toISOString(),
    profileSummary: seed.profile,
    semanticWorldSummary: {
      stats: graphStats(),
      dataStatus: seed.dataStatus,
    },
    plans: seed.strategyPlans.map((plan) => ({ ...plan, disclaimer: seed.disclaimer })),
    scenarioSummary: seed.scenarios.slice(0, 4),
    evidenceObjects: seed.evidenceObjects,
    riskNotes: seed.riskSignals,
    disclaimer: seed.disclaimer,
    dataSource: 'demo_seed',
  },
});

export const getSystemStatus = () => ({
  service: {
    apiStatus: 'ok',
    version: '0.1.0',
    environment: env.nodeEnv,
  },
  data: {
    dataSourceMode: 'demo_seed',
    providerApiEnabled: false,
    etfDataStatus: 'demo_ready',
    newsDataStatus: 'demo_ready',
    indexDataStatus: 'demo_ready',
    lastUpdatedAt: seed.dataStatus.lastUpdatedAt,
  },
  model: {
    enabled: isModelConfigured(),
    status: isModelConfigured() ? 'configured' : 'not_configured',
    provider: isModelConfigured() ? env.llm.provider : null,
    model: isModelConfigured() ? env.llm.model : null,
    apiKeyPreview: env.llm.apiKey ? `${env.llm.apiKey.slice(0, 3)}***${env.llm.apiKey.slice(-2)}` : null,
  },
  api: [
    { path: '/api/health', method: 'GET', status: 'available', dataSource: 'demo_seed' },
    { path: '/api/demo/bootstrap', method: 'GET', status: 'available', dataSource: 'demo_seed' },
    { path: '/api/semantic-world/graph', method: 'GET', status: 'available', dataSource: 'demo_seed' },
    { path: '/api/profile/parse', method: 'POST', status: 'available', dataSource: 'demo_seed' },
    { path: '/api/plan/generate', method: 'POST', status: isModelConfigured() ? 'available' : 'model_not_configured', dataSource: 'demo_seed' },
    { path: '/api/scenario/simulate', method: 'POST', status: 'available', dataSource: 'demo_seed' },
    { path: '/api/report/demo', method: 'GET', status: 'available', dataSource: 'demo_seed' },
    { path: '/api/system/status', method: 'GET', status: 'available', dataSource: 'demo_seed' }
  ],
  deployment: {
    docker: false,
    processManager: 'pm2',
    reverseProxy: 'nginx',
    frontend: 'static build',
  },
  swmPreview: {
    objects: seed.semanticGraph.nodes.map((node) => ({
      objectId: node.id,
      objectType: node.data?.objectType,
      title: node.data?.title,
      status: node.data?.status,
      dataSource: node.data?.dataSource,
      sourceSystem: node.data?.sourceSystem,
      createdAt: node.data?.updatedAt,
    })),
    relations: seed.semanticGraph.edges.map((edge) => ({
      relationId: edge.id,
      sourceObject: edge.source,
      targetObject: edge.target,
      relationType: edge.relationType,
      confidence: edge.data?.confidence,
      dataSource: edge.data?.dataSource,
    })),
    actions: seed.actionLogs,
    evidenceBindings: seed.evidenceObjects.map((item) => ({
      evidenceId: item.id,
      title: item.title,
      relatedObjects: item.relatedObjects,
      reviewStatus: item.reviewStatus,
      dataSource: item.dataSource,
    })),
  },
  dataSource: 'demo_seed',
});
