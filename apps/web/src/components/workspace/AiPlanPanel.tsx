import { Alert } from 'antd';
import { BrainCircuit } from 'lucide-react';
import type { EvidenceObject, StrategyPlan } from '../../types/domain';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';
import { StatusBadge } from '../common/StatusBadge';
import { StrategyPlanCard } from './StrategyPlanCard';

type AiPlanPanelProps = {
  plans: StrategyPlan[];
  evidence: EvidenceObject[];
  modelStatus?: string;
};

export function AiPlanPanel({ plans, evidence, modelStatus = 'not_configured' }: AiPlanPanelProps) {
  return (
    <GlassCard strong>
      <SectionHeader
        title="AI 投教辅助方案"
        description="基于用户目标、ETF 数据、新闻事件和证据链生成的投教型解释方案"
        extra={<StatusBadge tone="warning" icon={<BrainCircuit size={13} />}>模型{modelStatus === 'configured' ? '已配置' : '未配置'}</StatusBadge>}
      />
      {modelStatus !== 'configured' ? (
        <Alert
          type="warning"
          showIcon
          message="当前未配置真实模型，以下内容为 demo_seed 演示方案。"
          style={{ marginBottom: 12, borderRadius: 14 }}
        />
      ) : null}
      <div className="stack">
        {plans.map((plan) => (
          <StrategyPlanCard key={plan.id} plan={plan} evidence={evidence} />
        ))}
      </div>
    </GlassCard>
  );
}
