import { Progress, Tag } from 'antd';
import { UserRoundCheck } from 'lucide-react';
import type { InvestorProfile } from '../../types/domain';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';
import { StatusBadge } from '../common/StatusBadge';

type InvestorProfileCardProps = {
  profile?: InvestorProfile | null;
};

export function InvestorProfileCard({ profile }: InvestorProfileCardProps) {
  if (!profile) {
    return (
      <GlassCard>
        <SectionHeader title="用户画像" description="输入目标后生成投教画像" />
        <div className="soft-panel" style={{ padding: 14, color: '#526173' }}>
          暂未生成画像，默认加载 demo_seed 演示数据。
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <SectionHeader
        title="用户画像"
        description="基于目标输入形成的投教理解画像"
        extra={<StatusBadge icon={<UserRoundCheck size={13} />}>已生成</StatusBadge>}
      />
      <div className="profile-list">
        <div>
          <span>投资目标</span>
          <strong>{profile.investmentGoal}</strong>
        </div>
        <div>
          <span>风险偏好</span>
          <strong>{profile.riskLabel}</strong>
        </div>
        <div>
          <span>投资周期</span>
          <strong>{profile.timeHorizon}</strong>
        </div>
        <div>
          <span>知识水平</span>
          <strong>{profile.knowledgeLevel}</strong>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="field-label">画像置信度</div>
        <Progress percent={86} strokeColor="#6bbfc4" trailColor="rgba(120,146,180,0.16)" />
      </div>
      <div className="metric-row" style={{ marginTop: 12 }}>
        {['长期定投', '中等风险', '新手友好', '证据优先'].map((item) => (
          <Tag key={item} bordered={false} color="processing">
            {item}
          </Tag>
        ))}
      </div>
      <div className="mini-row" style={{ marginTop: 12 }}>
        <p className="mini-row-title">方案目标</p>
        <p className="mini-row-body">{profile.planGoal}</p>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: '#7b8794' }}>dataSource = {profile.dataSource}</div>
    </GlassCard>
  );
}
