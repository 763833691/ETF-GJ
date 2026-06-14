import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Badge, Progress, Tag } from 'antd';
import clsx from 'clsx';
import { categoryLabels } from './graphTheme';
import type { SemanticNodeData } from '../../types/domain';

export function SemanticNode({ data }: NodeProps) {
  const nodeData = data as SemanticNodeData;
  const confidence = Math.round((nodeData.confidence ?? 0.72) * 100);

  return (
    <div
      className={clsx(
        'semantic-node',
        `node-${nodeData.category}`,
        nodeData.dimmed && 'dimmed',
        nodeData.highlighted && 'highlighted',
      )}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
        <Tag bordered={false} style={{ margin: 0, background: 'rgba(255,255,255,0.58)', color: '#526173', fontSize: 11 }}>
          {categoryLabels[nodeData.category]}
        </Tag>
        <Badge status={nodeData.status === 'warning' ? 'warning' : 'processing'} />
      </div>
      <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: '#10233f' }}>{nodeData.title}</div>
      {nodeData.subtitle ? (
        <div style={{ marginTop: 3, fontSize: 12, color: '#526173', lineHeight: 1.45 }}>{nodeData.subtitle}</div>
      ) : null}
      <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Progress percent={confidence} showInfo={false} size="small" strokeColor="#6bbfc4" trailColor="rgba(120,146,180,0.16)" />
        <span style={{ fontSize: 11, color: '#7b8794' }}>{confidence}%</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: '#7b8794' }}>dataSource = {nodeData.dataSource}</div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
