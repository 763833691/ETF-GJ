import { Progress, Space, Tag } from 'antd';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { EvidenceObject, StrategyPlan } from '../../types/domain';
import { DisclaimerBlock } from '../common/DisclaimerBlock';

type StrategyPlanCardProps = {
  plan: StrategyPlan;
  evidence: EvidenceObject[];
};

export function StrategyPlanCard({ plan, evidence }: StrategyPlanCardProps) {
  const relatedEvidence = evidence.filter((item) => plan.evidenceIds.includes(item.id));

  return (
    <div className="plan-card">
      <div className="plan-head">
        <div>
          <h3>{plan.title}</h3>
          <p>{plan.scoreLabel}</p>
        </div>
        <strong>{plan.matchScore}%</strong>
      </div>
      <Progress percent={plan.matchScore} showInfo={false} strokeColor="#7f92c8" trailColor="rgba(120,146,180,0.16)" />
      <p className="plan-logic">{plan.logic}</p>
      <div className="metric-row">
        {plan.etfTypes.map((item) => (
          <Tag key={item} bordered={false} color="cyan">
            {item}
          </Tag>
        ))}
      </div>
      <div className="mini-list" style={{ marginTop: 10 }}>
        <div className="mini-row">
          <p className="mini-row-title">适合人群</p>
          <p className="mini-row-body">{plan.suitableFor}</p>
        </div>
        <div className="mini-row">
          <p className="mini-row-title">关键风险</p>
          <Space size={[6, 6]} wrap>
            {plan.risks.map((item) => (
              <Tag key={item} color="orange" bordered={false}>
                {item}
              </Tag>
            ))}
          </Space>
        </div>
        <div className="mini-row">
          <p className="mini-row-title">
            <ShieldCheck size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
            证据来源
          </p>
          <Space size={[6, 6]} wrap>
            {relatedEvidence.slice(0, 3).map((item) => (
              <Tag key={item.id} color="gold" bordered={false}>
                {item.type}
              </Tag>
            ))}
          </Space>
        </div>
      </div>
      <div className="plan-link">
        <span>dataSource = {plan.dataSource}</span>
        <ArrowRight size={15} />
      </div>
      <DisclaimerBlock compact />
    </div>
  );
}
