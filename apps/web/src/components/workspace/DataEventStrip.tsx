import { Col, Row, Tag } from 'antd';
import { Activity, FileCheck2, Newspaper, ShieldAlert } from 'lucide-react';
import type { EvidenceObject, MarketEvent, RiskSignal } from '../../types/domain';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';

type DataEventStripProps = {
  newsEvents: MarketEvent[];
  riskSignals: RiskSignal[];
  evidence: EvidenceObject[];
};

export function DataEventStrip({ newsEvents, riskSignals, evidence }: DataEventStripProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={8}>
        <GlassCard>
          <SectionHeader title="新闻事件" kicker="demo_seed 新闻事件" extra={<Newspaper size={18} color="#326ea6" />} />
          <div className="mini-list">
            {newsEvents.slice(0, 3).map((item) => (
              <div className="mini-row" key={item.id}>
                <p className="mini-row-title">{item.title}</p>
                <p className="mini-row-body">{item.summary}</p>
                <Tag bordered={false} color="blue">{item.sourceStatus}</Tag>
              </div>
            ))}
          </div>
        </GlassCard>
      </Col>
      <Col xs={24} lg={8}>
        <GlassCard>
          <SectionHeader title="风险信号" kicker="风险解释对象" extra={<ShieldAlert size={18} color="#d9a36f" />} />
          <div className="mini-list">
            {riskSignals.slice(0, 3).map((item) => (
              <div className="mini-row" key={item.id}>
                <p className="mini-row-title">{item.title}</p>
                <p className="mini-row-body">{item.explanation}</p>
                <Tag bordered={false} color="orange">{item.level}</Tag>
              </div>
            ))}
          </div>
        </GlassCard>
      </Col>
      <Col xs={24} lg={8}>
        <GlassCard>
          <SectionHeader title="证据摘要" kicker="证据闭环" extra={<FileCheck2 size={18} color="#c8ae72" />} />
          <div className="mini-list">
            {evidence.slice(0, 3).map((item) => (
              <div className="mini-row" key={item.id}>
                <p className="mini-row-title">{item.title}</p>
                <p className="mini-row-body">{item.summary}</p>
                <Tag bordered={false} color="gold">{item.reviewStatus}</Tag>
              </div>
            ))}
          </div>
        </GlassCard>
      </Col>
      <Col span={24}>
        <GlassCard>
          <div className="data-source-line">
            <Activity size={16} />
            当前使用演示数据，仅用于功能展示。真实 ETF 数据、指数数据和新闻数据接口已预留接入位。
          </div>
        </GlassCard>
      </Col>
    </Row>
  );
}
