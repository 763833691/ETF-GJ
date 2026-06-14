import { Space, Tag } from 'antd';
import { Route, ShieldAlert } from 'lucide-react';
import type { EvidenceObject, ScenarioResult } from '../../types/domain';
import { DisclaimerBlock } from '../common/DisclaimerBlock';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';
import { ScenarioImpactChart } from './ScenarioImpactChart';

type ScenarioImpactPanelProps = {
  scenario: ScenarioResult;
  evidence: EvidenceObject[];
};

export function ScenarioImpactPanel({ scenario, evidence }: ScenarioImpactPanelProps) {
  const relatedEvidence = evidence.filter((item) => scenario.evidenceIds.includes(item.id));

  return (
    <GlassCard strong>
      <SectionHeader title="推演结果与风险解释" description={scenario.summary} extra={<ShieldAlert size={18} color="#d9a36f" />} />
      <div className="stack">
        <div className="soft-panel" style={{ padding: 14 }}>
          <div className="field-label">
            <Route size={13} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            受影响路径
          </div>
          <Space size={[6, 6]} wrap>
            {scenario.affectedPath.map((item) => (
              <Tag key={item} bordered={false} color="blue">
                {item}
              </Tag>
            ))}
          </Space>
        </div>
        <ScenarioImpactChart scenario={scenario} />
        <div className="mini-row">
          <p className="mini-row-title">方案稳定性变化</p>
          <p className="mini-row-body">{scenario.planImpact}</p>
        </div>
        <div className="mini-row">
          <p className="mini-row-title">重新评估提示</p>
          <p className="mini-row-body">{scenario.reEvaluateReason}</p>
        </div>
        <div className="mini-row">
          <p className="mini-row-title">证据来源</p>
          <Space size={[6, 6]} wrap>
            {relatedEvidence.map((item) => (
              <Tag key={item.id} color="gold" bordered={false}>
                {item.title}
              </Tag>
            ))}
          </Space>
        </div>
        <DisclaimerBlock compact />
      </div>
    </GlassCard>
  );
}
