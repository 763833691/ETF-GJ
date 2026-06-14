import rawSeed from '../../../../data/demoSeed.json';
import type {
  BootstrapData,
  DataStatus,
  EvidenceObject,
  GraphStats,
  InvestorProfile,
  MarketEvent,
  ReportData,
  RiskSignal,
  ScenarioResult,
  SemanticGraphResponse,
  StrategyPlan,
} from '../types/domain';

type DemoSeed = typeof rawSeed;

export const demoSeed = rawSeed as DemoSeed;

export const DISCLAIMER = demoSeed.disclaimer;

export const graphStats = (): GraphStats => ({
  objectCount: demoSeed.semanticGraph.nodes.length,
  relationCount: demoSeed.semanticGraph.edges.length,
  evidenceCount: demoSeed.evidenceObjects.length,
  riskSignalCount: demoSeed.riskSignals.length,
  newsEventCount: demoSeed.newsEvents.length,
});

export const getLocalBootstrap = (): BootstrapData => ({
  app: demoSeed.app as BootstrapData['app'],
  defaultProject: demoSeed.defaultProject,
  dataStatus: demoSeed.dataStatus as DataStatus,
  graphStats: graphStats(),
  profile: demoSeed.profile as InvestorProfile,
  plans: demoSeed.strategyPlans as StrategyPlan[],
  newsEvents: demoSeed.newsEvents.slice(0, 4) as MarketEvent[],
  riskSignals: demoSeed.riskSignals as RiskSignal[],
  evidenceObjects: demoSeed.evidenceObjects.slice(0, 6) as EvidenceObject[],
  disclaimer: demoSeed.disclaimer,
  dataSource: 'demo_seed',
});

export const getLocalGraph = (): SemanticGraphResponse => ({
  nodes: demoSeed.semanticGraph.nodes as SemanticGraphResponse['nodes'],
  edges: demoSeed.semanticGraph.edges as SemanticGraphResponse['edges'],
  stats: graphStats(),
  dataStatus: demoSeed.dataStatus as DataStatus,
});

export const getLocalReport = (): { report: ReportData } => ({
  report: {
    id: 'report_demo_001',
    title: 'ETF 智能投教辅助报告',
    generatedAt: new Date().toISOString(),
    profileSummary: demoSeed.profile as InvestorProfile,
    semanticWorldSummary: {
      stats: graphStats(),
      dataStatus: demoSeed.dataStatus as DataStatus,
    },
    plans: demoSeed.strategyPlans as StrategyPlan[],
    scenarioSummary: demoSeed.scenarios.slice(0, 4) as ScenarioResult[],
    evidenceObjects: demoSeed.evidenceObjects as EvidenceObject[],
    riskNotes: demoSeed.riskSignals as RiskSignal[],
    disclaimer: demoSeed.disclaimer,
    dataSource: 'demo_seed',
  },
});

export const getLocalScenario = (scenarioType: string) => {
  const scenario = demoSeed.scenarios.find((item) => item.scenarioType === scenarioType) ?? demoSeed.scenarios[0];
  return {
    scenarioRun: {
      ...scenario,
      disclaimer: demoSeed.disclaimer,
    } as ScenarioResult,
    graphPatch: {
      highlightNodeIds: scenario.highlightNodeIds,
      highlightEdgeIds: scenario.highlightEdgeIds,
    },
    dataSource: 'demo_seed',
  };
};

export const getLocalSystemStatus = () => ({
  service: { apiStatus: 'fallback', version: '0.1.0', environment: 'frontend_fallback' },
  data: {
    dataSourceMode: 'demo_seed',
    providerApiEnabled: false,
    etfDataStatus: 'demo_ready',
    newsDataStatus: 'demo_ready',
    indexDataStatus: 'demo_ready',
    lastUpdatedAt: demoSeed.dataStatus.lastUpdatedAt,
  },
  model: { enabled: false, status: 'not_configured', provider: null, model: null, apiKeyPreview: null },
  api: [
    { path: '/api/health', method: 'GET', status: 'fallback', dataSource: 'demo_seed' },
    { path: '/api/semantic-world/graph', method: 'GET', status: 'fallback', dataSource: 'demo_seed' },
  ],
  deployment: {
    docker: false,
    processManager: 'pm2',
    reverseProxy: 'nginx',
    frontend: 'static build',
  },
  swmPreview: {
    objects: demoSeed.semanticGraph.nodes.map((node) => ({
      objectId: node.id,
      objectType: node.data.objectType,
      title: node.data.title,
      status: node.data.status,
      dataSource: node.data.dataSource,
      sourceSystem: node.data.sourceSystem,
      createdAt: node.data.updatedAt,
    })),
    relations: demoSeed.semanticGraph.edges.map((edge) => ({
      relationId: edge.id,
      sourceObject: edge.source,
      targetObject: edge.target,
      relationType: edge.relationType,
      confidence: edge.data?.confidence,
      dataSource: edge.data?.dataSource,
    })),
    actions: demoSeed.actionLogs,
    evidenceBindings: demoSeed.evidenceObjects.map((item) => ({
      evidenceId: item.id,
      title: item.title,
      relatedObjects: item.relatedObjects,
      reviewStatus: item.reviewStatus,
      dataSource: item.dataSource,
    })),
  },
  dataSource: 'demo_seed',
});
