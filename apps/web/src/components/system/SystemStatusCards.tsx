import { Col, Row, Statistic, Tag } from 'antd';
import { Activity, BrainCircuit, Database, Network, ServerCog } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';

type SystemStatusCardsProps = {
  status: any;
};

export function SystemStatusCards({ status }: SystemStatusCardsProps) {
  const cards = [
    { title: 'ETF 数据源', value: status.data?.etfDataStatus ?? 'demo_ready', icon: Database },
    { title: '新闻数据源', value: status.data?.newsDataStatus ?? 'demo_ready', icon: Network },
    { title: '模型状态', value: status.model?.status ?? 'not_configured', icon: BrainCircuit },
    { title: 'API 状态', value: status.service?.apiStatus ?? 'ok', icon: Activity },
    { title: '进程管理', value: status.deployment?.processManager ?? 'pm2', icon: ServerCog },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Col xs={24} md={12} xl={8} key={card.title}>
            <GlassCard>
              <SectionHeader title={card.title} extra={<Icon size={18} color="#326ea6" />} />
              <Statistic value={card.value} valueStyle={{ color: '#10233f', fontSize: 20 }} />
              <Tag color="processing" style={{ marginTop: 10 }}>只读状态</Tag>
            </GlassCard>
          </Col>
        );
      })}
    </Row>
  );
}
