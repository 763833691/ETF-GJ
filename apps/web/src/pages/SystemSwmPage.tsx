import { Skeleton, Table, Tabs, Tag } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';

export function SystemSwmPage() {
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard strong style={{ marginBottom: 16 }}>
        <SectionHeader
          title="语义世界调试台"
          description="只读展示语义对象、关系、动作和证据绑定。正式 SWM 接入待后续阶段完成。"
          extra={<StatusBadge>dataSource = demo_seed</StatusBadge>}
        />
      </GlassCard>
      <GlassCard>
        <Tabs
          items={[
            {
              key: 'objects',
              label: '语义对象',
              children: (
                <Table
                  size="small"
                  rowKey="objectId"
                  dataSource={status.swmPreview.objects}
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'object_id', dataIndex: 'objectId' },
                    { title: 'object_type', dataIndex: 'objectType' },
                    { title: 'title', dataIndex: 'title' },
                    { title: 'status', dataIndex: 'status', render: (value) => <Tag>{value}</Tag> },
                    { title: 'data_source', dataIndex: 'dataSource', render: (value) => <Tag color="processing">{value}</Tag> },
                    { title: 'source_system', dataIndex: 'sourceSystem' },
                  ]}
                />
              ),
            },
            {
              key: 'relations',
              label: '语义关系',
              children: (
                <Table
                  size="small"
                  rowKey="relationId"
                  dataSource={status.swmPreview.relations}
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'source_object', dataIndex: 'sourceObject' },
                    { title: 'target_object', dataIndex: 'targetObject' },
                    { title: 'relation_type', dataIndex: 'relationType' },
                    { title: 'confidence', dataIndex: 'confidence' },
                    { title: 'data_source', dataIndex: 'dataSource', render: (value) => <Tag color="processing">{value}</Tag> },
                  ]}
                />
              ),
            },
            {
              key: 'actions',
              label: '语义动作',
              children: (
                <Table
                  size="small"
                  rowKey="id"
                  dataSource={status.swmPreview.actions}
                  pagination={false}
                  columns={[
                    { title: 'action_type', dataIndex: 'actionType' },
                    { title: 'target_object', dataIndex: 'targetObject' },
                    { title: 'status', dataIndex: 'status', render: (value) => <Tag color="blue">{value}</Tag> },
                    { title: 'source_system', dataIndex: 'sourceSystem' },
                    { title: 'data_source', dataIndex: 'dataSource', render: (value) => <Tag color="processing">{value}</Tag> },
                  ]}
                />
              ),
            },
            {
              key: 'evidence',
              label: '证据绑定',
              children: (
                <Table
                  size="small"
                  rowKey="evidenceId"
                  dataSource={status.swmPreview.evidenceBindings}
                  pagination={{ pageSize: 8 }}
                  columns={[
                    { title: 'evidence_id', dataIndex: 'evidenceId' },
                    { title: 'title', dataIndex: 'title' },
                    { title: 'related_objects', dataIndex: 'relatedObjects', render: (value: string[]) => value?.join(' / ') },
                    { title: 'review_status', dataIndex: 'reviewStatus', render: (value) => <Tag color="gold">{value}</Tag> },
                    { title: 'data_source', dataIndex: 'dataSource', render: (value) => <Tag color="processing">{value}</Tag> },
                  ]}
                />
              ),
            },
            {
              key: 'feedback',
              label: '反馈事件',
              children: <div className="disclaimer">反馈事件为后续 SWM 接入预留，第一阶段只读展示。</div>,
            },
          ]}
        />
      </GlassCard>
    </motion.div>
  );
}
