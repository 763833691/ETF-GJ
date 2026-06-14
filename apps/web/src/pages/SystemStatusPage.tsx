import { Skeleton, Table, Tag } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { SystemStatusCards } from '../components/system/SystemStatusCards';
import { api } from '../services/api';

export function SystemStatusPage() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    api.getSystemStatus().then(setStatus);
  }, []);

  if (!status) {
    return (
      <GlassCard strong>
        <Skeleton active paragraph={{ rows: 12 }} />
      </GlassCard>
    );
  }

  return (
    <motion.div className="stack" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard strong>
        <SectionHeader
          title="数据与模型状态"
          description="只读展示当前 Demo 运行状态，不展示完整模型密钥，不提供模型配置入口。"
          extra={<StatusBadge tone="warning">模型：{status.model.status}</StatusBadge>}
        />
        <div className="metric-row">
          <Tag color="processing">dataSource = {status.data.dataSourceMode}</Tag>
          <Tag>provider_api：待接入</Tag>
          <Tag>前端：static build</Tag>
          <Tag>API：PM2 process</Tag>
          <Tag>Nginx：reverse proxy</Tag>
        </div>
      </GlassCard>

      <SystemStatusCards status={status} />

      <GlassCard>
        <SectionHeader title="接口状态" description="所有接口仅展示安全状态，不暴露敏感配置。" />
        <Table
          size="small"
          rowKey="path"
          dataSource={status.api}
          pagination={false}
          columns={[
            { title: '方法', dataIndex: 'method', width: 90 },
            { title: '路径', dataIndex: 'path' },
            { title: '状态', dataIndex: 'status', render: (value) => <Tag color={value === 'available' ? 'green' : 'gold'}>{value}</Tag> },
            { title: '数据源', dataIndex: 'dataSource', render: (value) => <Tag color="processing">{value}</Tag> },
          ]}
        />
      </GlassCard>

      <GlassCard>
        <SectionHeader title="模型与数据安全边界" />
        <div className="mini-list">
          <div className="mini-row">
            <p className="mini-row-title">模型状态</p>
            <p className="mini-row-body">
              当前未配置真实模型，AI 方案区域展示 demo_seed 演示数据。页面不展示完整模型密钥，不提供前端配置入口。
            </p>
          </div>
          <div className="mini-row">
            <p className="mini-row-title">真实接口接入位</p>
            <p className="mini-row-body">ETF 数据、指数数据、新闻数据、Knowledge Hub、my_blueprint、SWM 均保留接口和字段预留。</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
