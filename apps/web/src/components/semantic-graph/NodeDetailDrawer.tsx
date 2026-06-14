import { Descriptions, Drawer, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { Database, ShieldAlert } from 'lucide-react';
import type { SemanticGraphNode } from '../../types/domain';
import { categoryLabels } from './graphTheme';

type NodeDetailDrawerProps = {
  node?: SemanticGraphNode | null;
  open: boolean;
  onClose: () => void;
};

export function NodeDetailDrawer({ node, open, onClose }: NodeDetailDrawerProps) {
  const data = node?.data;

  return (
    <Drawer
      title={data?.title ?? '节点详情'}
      open={open}
      onClose={onClose}
      width={440}
      className="node-detail-drawer"
      styles={{
        body: { background: 'linear-gradient(180deg, rgba(246,248,252,0.92), rgba(238,243,249,0.88))' },
        header: { background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(18px)' },
      }}
    >
      {data ? (
        <div className="stack">
          <div className="soft-panel" style={{ padding: 14 }}>
            <Typography.Paragraph style={{ marginBottom: 10, color: '#526173' }}>{data.summary}</Typography.Paragraph>
            <div className="metric-row">
              <Tag>{categoryLabels[data.category]}</Tag>
              <Tag>{data.objectType}</Tag>
              <Tag color={data.status === 'warning' ? 'orange' : 'blue'}>{data.status ?? 'active'}</Tag>
              {data.riskLevel ? <Tag color="gold">risk: {data.riskLevel}</Tag> : null}
            </div>
          </div>

          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="对象 ID">{node?.id}</Descriptions.Item>
            <Descriptions.Item label="数据来源">
              <Database size={13} style={{ marginRight: 6, verticalAlign: '-2px' }} />
              {data.dataSource}
            </Descriptions.Item>
            <Descriptions.Item label="来源系统">{data.sourceSystem ?? 'semantic_world'}</Descriptions.Item>
            <Descriptions.Item label="来源引用">{data.sourceRef ?? 'demo_seed'}</Descriptions.Item>
            <Descriptions.Item label="置信度">{Math.round((data.confidence ?? 0) * 100)}%</Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {data.updatedAt ? dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm') : '演示时间'}
            </Descriptions.Item>
          </Descriptions>

          <div className="disclaimer">
            <ShieldAlert size={15} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            当前节点来自 demo_seed，演示数据仅用于功能展示。
          </div>

          {data.metadata ? (
            <div className="soft-panel" style={{ padding: 14 }}>
              <Typography.Text strong>原始字段预览</Typography.Text>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: '#526173' }}>
                {JSON.stringify(data.metadata, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
}
