export type DataSource = 'demo_seed' | 'provider_api' | 'manual_import' | 'model_generated' | 'system_generated';

export type SemanticCategory = 'user' | 'asset' | 'metric' | 'event' | 'risk' | 'evidence' | 'strategy';

export type SemanticNodeData = {
  objectType: string;
  category: SemanticCategory;
  title: string;
  subtitle?: string;
  summary?: string;
  status?: string;
  confidence?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  dataSource: DataSource;
  sourceSystem?: 'etf_app' | 'semantic_world' | 'knowledge_hub' | 'my_blueprint';
  sourceRef?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
  dimmed?: boolean;
  highlighted?: boolean;
};

export type SemanticGraphNode = {
  id: string;
  type: 'semanticNode';
  position: { x: number; y: number };
  data: SemanticNodeData;
};

export type SemanticGraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  relationType: string;
  animated?: boolean;
  data?: {
    dataSource: DataSource;
    confidence?: number;
    explanation?: string;
    dimmed?: boolean;
    highlighted?: boolean;
  };
};

export type GraphStats = {
  objectCount: number;
  relationCount: number;
  evidenceCount: number;
  riskSignalCount: number;
  newsEventCount: number;
};

export type DataStatus = {
  dataSource: DataSource;
  etfDataStatus: string;
  newsDataStatus: string;
  indexDataStatus: string;
  riskSignalStatus?: string;
  evidenceStatus?: string;
  providerApiEnabled: boolean;
  modelStatus: string;
  lastUpdatedAt: string;
};

export type InvestorProfile = {
  id: string;
  objectType: string;
  investmentGoal: string;
  monthlyBudget: number;
  timeHorizon: string;
  riskPreference: string;
  riskLabel: string;
  experienceLevel: string;
  knowledgeLevel: string;
  themePreferences: string[];
  riskFocus: string[];
  planGoal: string;
  naturalLanguageGoal?: string;
  dataSource: DataSource;
};

export type StrategyPlan = {
  id: string;
  title: string;
  matchScore: number;
  scoreLabel: string;
  suitableFor: string;
  logic: string;
  etfTypes: string[];
  risks: string[];
  evidenceIds: string[];
  disclaimer?: string;
  dataSource: DataSource;
};

export type MarketEvent = {
  id: string;
  eventType: string;
  title: string;
  summary: string;
  relatedObjects: string[];
  riskLevel: 'low' | 'medium' | 'high';
  sentiment?: string;
  occurredAt: string;
  sourceStatus: string;
  dataSource: DataSource;
};

export type RiskSignal = {
  id: string;
  title: string;
  level: string;
  affectedObjects: string[];
  trigger: string;
  explanation: string;
  updatedAt: string;
  dataSource: DataSource;
};

export type EvidenceObject = {
  id: string;
  title: string;
  type: string;
  source: string;
  summary: string;
  relatedObjects: string[];
  usedForPlan: boolean;
  reviewStatus: string;
  updatedAt: string;
  dataSource: DataSource;
};

export type ScenarioResult = {
  scenarioType: string;
  title: string;
  summary: string;
  affectedObjects: string[];
  affectedPath: string[];
  riskChanges: Array<{ name: string; before: number; after: number }>;
  planImpact: string;
  reEvaluateReason: string;
  highlightNodeIds: string[];
  highlightEdgeIds: string[];
  evidenceIds: string[];
  disclaimer?: string;
  dataSource: DataSource;
};

export type BootstrapData = {
  app: { name: string; subtitle: string; dataSource: DataSource };
  defaultProject: Record<string, string>;
  dataStatus: DataStatus;
  graphStats: GraphStats;
  profile: InvestorProfile;
  plans: StrategyPlan[];
  newsEvents: MarketEvent[];
  riskSignals: RiskSignal[];
  evidenceObjects: EvidenceObject[];
  disclaimer: string;
  dataSource: DataSource;
};

export type SemanticGraphResponse = {
  nodes: SemanticGraphNode[];
  edges: SemanticGraphEdge[];
  stats: GraphStats;
  dataStatus: DataStatus;
};

export type ModelConfig = {
  enabled: boolean;
  configured: boolean;
  testable: boolean;
  status: string;
  provider: 'openai' | 'openai_compatible' | 'volcengine_ark';
  apiMode: 'responses' | 'chat_completions';
  baseUrl: string;
  model: string;
  hasApiKey: boolean;
  apiKeyPreview: string | null;
  source: 'environment' | 'runtime';
  runtimeConfigAllowed: boolean;
};

export type WorkspaceGenerationResponse = {
  profile: InvestorProfile;
  plans: StrategyPlan[];
  graphPatch: {
    nodes: SemanticGraphNode[];
    edges: SemanticGraphEdge[];
    highlightNodeIds: string[];
    highlightEdgeIds: string[];
  };
  analysisSummary: string;
  model: {
    status: string;
    provider: string;
    model: string;
  };
  dataSource: DataSource;
};

export type ReportData = {
  id: string;
  title: string;
  generatedAt: string;
  profileSummary: InvestorProfile;
  semanticWorldSummary: {
    stats: GraphStats;
    dataStatus: DataStatus;
  };
  plans: StrategyPlan[];
  scenarioSummary: ScenarioResult[];
  evidenceObjects: EvidenceObject[];
  riskNotes: RiskSignal[];
  disclaimer: string;
  dataSource: DataSource;
};
