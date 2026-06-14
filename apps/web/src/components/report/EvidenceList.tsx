import { Table, Tag } from 'antd';
import type { EvidenceObject } from '../../types/domain';

type EvidenceListProps = {
  evidence: EvidenceObject[];
};

export function EvidenceList({ evidence }: EvidenceListProps) {
  return (
    <Table
      size="small"
      rowKey="id"
      dataSource={evidence}
      pagination={{ pageSize: 6 }}
      columns={[
        { title: '证据标题', dataIndex: 'title' },
        { title: '证据类型', dataIndex: 'type', width: 130 },
        { title: '来源', dataIndex: 'source', width: 110 },
        {
          title: '用于方案',
          dataIndex: 'usedForPlan',
          width: 96,
          render: (value: boolean) => (value ? <Tag color="blue">是</Tag> : <Tag>否</Tag>),
        },
        {
          title: '状态',
          dataIndex: 'reviewStatus',
          width: 120,
          render: (value: string) => <Tag color="gold">{value}</Tag>,
        },
        {
          title: '数据源',
          dataIndex: 'dataSource',
          width: 130,
          render: (value: string) => <Tag color="processing">{value}</Tag>,
        },
      ]}
    />
  );
}
