import {
  Background,
  BackgroundVariant,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react';
import { Space } from 'antd';
import { Database, GitBranch, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  DataStatus,
  SemanticGraphEdge,
  SemanticGraphNode as DomainNode,
} from '../../types/domain';
import { SectionHeader } from '../common/SectionHeader';
import { StatusBadge } from '../common/StatusBadge';
import { GraphToolbar } from './GraphToolbar';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { SemanticEdge } from './SemanticEdge';
import { SemanticNode } from './SemanticNode';
import { layoutSemanticGraph } from './graphLayout';
import {
  planPathEdgeIds,
  planPathNodeIds,
  type GraphFilter,
} from './graphTheme';

const nodeTypes = { semanticNode: SemanticNode };
const edgeTypes = { semanticEdge: SemanticEdge };
const EMPTY_HIGHLIGHT_IDS: string[] = [];

type SemanticWorldGraphProps = {
  nodes: DomainNode[];
  edges: SemanticGraphEdge[];
  dataStatus: DataStatus;
  highlightNodeIds?: string[];
  highlightEdgeIds?: string[];
  onNodeSelect?: (node: DomainNode) => void;
};

function buildRenderedNodes(
  nodes: DomainNode[],
  filter: GraphFilter,
  activeNodeIds: Set<string>,
  currentNodes: Node[] = [],
): Node[] {
  const currentNodeById = new Map(currentNodes.map((node) => [node.id, node]));

  return nodes.map((node) => {
    const categoryMatches =
      filter === 'all' || filter === 'strategy' || node.data.category === filter;
    const highlighted = activeNodeIds.has(node.id);
    const dimmed = filter !== 'all' && !categoryMatches && !highlighted;
    const currentNode = currentNodeById.get(node.id);

    return {
      ...currentNode,
      ...node,
      position: currentNode?.position ?? node.position,
      draggable: true,
      selectable: true,
      connectable: false,
      data: {
        ...node.data,
        highlighted,
        dimmed,
      },
    };
  });
}

function buildRenderedEdges(
  edges: SemanticGraphEdge[],
  nodes: DomainNode[],
  filter: GraphFilter,
  activeNodeIds: Set<string>,
  activeEdgeIds: Set<string>,
  currentEdges: Edge[] = [],
): Edge[] {
  const currentEdgeById = new Map(currentEdges.map((edge) => [edge.id, edge]));
  const visibleNodeIds = new Set(
    nodes
      .filter((node) => {
        const categoryMatches =
          filter === 'all' || filter === 'strategy' || node.data.category === filter;
        return categoryMatches || activeNodeIds.has(node.id);
      })
      .map((node) => node.id),
  );

  return edges.map((edge) => {
    const highlighted = activeEdgeIds.has(edge.id);
    const categoryVisible =
      filter === 'all' ||
      filter === 'strategy' ||
      visibleNodeIds.has(edge.source) ||
      visibleNodeIds.has(edge.target);

    return {
      ...currentEdgeById.get(edge.id),
      ...edge,
      type: 'semanticEdge',
      selectable: true,
      data: {
        ...edge.data,
        highlighted,
        dimmed: filter !== 'all' && !categoryVisible && !highlighted,
      },
    };
  });
}

export function SemanticWorldGraph({
  nodes,
  edges,
  dataStatus,
  highlightNodeIds = EMPTY_HIGHLIGHT_IDS,
  highlightEdgeIds = EMPTY_HIGHLIGHT_IDS,
  onNodeSelect,
}: SemanticWorldGraphProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<GraphFilter>('all');
  const [selectedNode, setSelectedNode] = useState<DomainNode | null>(null);
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null);

  const layoutedNodes = useMemo(
    () => layoutSemanticGraph(nodes, edges),
    [edges, nodes],
  );
  const activeNodeIds = useMemo(
    () =>
      new Set([
        ...highlightNodeIds,
        ...(filter === 'strategy' ? [...planPathNodeIds] : []),
      ]),
    [filter, highlightNodeIds],
  );
  const activeEdgeIds = useMemo(
    () =>
      new Set([
        ...highlightEdgeIds,
        ...(filter === 'strategy' ? [...planPathEdgeIds] : []),
      ]),
    [filter, highlightEdgeIds],
  );

  const initialRenderedNodes = useMemo(
    () => buildRenderedNodes(layoutedNodes, filter, activeNodeIds),
    [activeNodeIds, filter, layoutedNodes],
  );
  const initialRenderedEdges = useMemo(
    () =>
      buildRenderedEdges(
        edges,
        layoutedNodes,
        filter,
        activeNodeIds,
        activeEdgeIds,
      ),
    [activeEdgeIds, activeNodeIds, edges, filter, layoutedNodes],
  );
  const [renderedNodes, setRenderedNodes, onNodesChange] =
    useNodesState(initialRenderedNodes);
  const [renderedEdges, setRenderedEdges, onEdgesChange] =
    useEdgesState(initialRenderedEdges);

  useEffect(() => {
    setRenderedNodes(
      buildRenderedNodes(layoutedNodes, filter, activeNodeIds),
    );
    const timer = window.setTimeout(
      () => flow?.fitView({ padding: 0.1, duration: 500, maxZoom: 0.96 }),
      30,
    );
    return () => window.clearTimeout(timer);
  }, [layoutedNodes, setRenderedNodes]);

  useEffect(() => {
    setRenderedNodes((currentNodes) =>
      buildRenderedNodes(layoutedNodes, filter, activeNodeIds, currentNodes),
    );
  }, [activeNodeIds, filter, layoutedNodes, setRenderedNodes]);

  useEffect(() => {
    setRenderedEdges((currentEdges) =>
      buildRenderedEdges(
        edges,
        layoutedNodes,
        filter,
        activeNodeIds,
        activeEdgeIds,
        currentEdges,
      ),
    );
  }, [
    activeEdgeIds,
    activeNodeIds,
    edges,
    filter,
    layoutedNodes,
    setRenderedEdges,
  ]);

  const handleNodeClick = (_: unknown, node: Node) => {
    const domainNode = nodes.find((item) => item.id === node.id) ?? null;
    setSelectedNode(domainNode);
    if (domainNode) onNodeSelect?.(domainNode);
  };

  const handleRelayout = () => {
    setRenderedNodes(buildRenderedNodes(layoutedNodes, filter, activeNodeIds));
    window.setTimeout(
      () => flow?.fitView({ padding: 0.1, duration: 520, maxZoom: 0.96 }),
      20,
    );
  };

  const handleInit = (instance: ReactFlowInstance) => {
    setFlow(instance);
    window.setTimeout(
      () => instance.fitView({ padding: 0.08, duration: 0, maxZoom: 0.96 }),
      0,
    );
  };

  const handleToggleFullscreen = async () => {
    if (!shellRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await shellRef.current.requestFullscreen();
    }
    window.setTimeout(
      () => flow?.fitView({ padding: 0.1, duration: 420, maxZoom: 1 }),
      120,
    );
  };

  return (
    <div className="semantic-graph-shell" ref={shellRef}>
      <SectionHeader
        title="ETF 语义世界画布"
        description="ETF 数据、指数信息、新闻事件、风险信号与用户目标的语义关系图"
        extra={
          <GraphToolbar
            activeFilter={filter}
            onFilterChange={setFilter}
            onResetView={() =>
              flow?.fitView({ padding: 0.1, duration: 420, maxZoom: 0.96 })
            }
            onRelayout={handleRelayout}
            onToggleFullscreen={handleToggleFullscreen}
          />
        }
      />

      <div className="graph-status-row">
        <Space size={[8, 8]} wrap>
          <StatusBadge icon={<Database size={13} />}>
            数据源：{dataStatus.dataSource}
          </StatusBadge>
          <StatusBadge tone="success">ETF 数据：演示数据</StatusBadge>
          <StatusBadge tone="success">指数数据：演示数据</StatusBadge>
          <StatusBadge tone="muted" icon={<GitBranch size={13} />}>
            节点 {nodes.length} / 关系 {edges.length}
          </StatusBadge>
          <StatusBadge
            tone={dataStatus.modelStatus === 'configured' ? 'success' : 'warning'}
            icon={<ShieldAlert size={13} />}
          >
            {dataStatus.modelStatus === 'configured'
              ? '真实模型已接入'
              : '真实模型待接入'}
          </StatusBadge>
        </Space>
      </div>

      <div className="semantic-flow-wrap">
        <ReactFlow
          nodes={renderedNodes}
          edges={renderedEdges}
          className="semantic-react-flow"
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={handleInit}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.08, maxZoom: 0.96 }}
          minZoom={0.32}
          maxZoom={1.4}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={28}
            size={1}
            color="rgba(86,116,160,0.16)"
          />
        </ReactFlow>
      </div>

      <NodeDetailDrawer
        node={selectedNode}
        open={Boolean(selectedNode)}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
