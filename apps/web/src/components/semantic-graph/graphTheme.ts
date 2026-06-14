import type { SemanticCategory } from '../../types/domain';

export const categoryLabels: Record<SemanticCategory, string> = {
  user: '用户目标',
  asset: 'ETF 数据',
  metric: '数据指标',
  event: '新闻事件',
  risk: '风险信号',
  evidence: '证据链',
  strategy: '方案路径',
};

export const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'user', label: '用户目标' },
  { key: 'asset', label: 'ETF 数据' },
  { key: 'event', label: '新闻事件' },
  { key: 'risk', label: '风险信号' },
  { key: 'evidence', label: '证据链' },
  { key: 'strategy', label: '方案路径' },
] as const;

export type GraphFilter = (typeof filterOptions)[number]['key'];

export const planPathNodeIds = new Set([
  'profile_demo_001',
  'goal_demo_001',
  'etf_broad_001',
  'etf_dividend_001',
  'risk_profile_demo_001',
  'plan_stable_learning',
  'evidence_basic_data',
  'evidence_rule_risk',
  'source_demo_seed',
]);

export const planPathEdgeIds = new Set([
  'edge_profile_goal',
  'edge_profile_risk',
  'edge_goal_broad',
  'edge_goal_dividend',
  'edge_plan_stable_goal',
  'edge_plan_stable_broad',
  'edge_plan_stable_dividend',
  'edge_plan_stable_ev1',
  'edge_plan_stable_ev2',
  'edge_evidence_source_1',
  'edge_evidence_source_2',
]);
