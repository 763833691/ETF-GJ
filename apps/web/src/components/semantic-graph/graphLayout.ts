import type { SemanticGraphEdge, SemanticGraphNode } from '../../types/domain';

const MAX_ROWS = 5;
const COLUMN_STEP = 220;
const ROW_STEP = 166;

type Lane =
  | 'user'
  | 'asset_product'
  | 'asset_structure'
  | 'context'
  | 'risk'
  | 'strategy'
  | 'evidence';

const laneOrder: Lane[] = [
  'user',
  'asset_product',
  'asset_structure',
  'context',
  'risk',
  'strategy',
  'evidence',
];

function getLane(node: SemanticGraphNode): Lane {
  const { category, objectType, title } = node.data;

  if (category === 'user') return 'user';
  if (category === 'event' || category === 'metric') return 'context';
  if (category === 'risk') return 'risk';
  if (category === 'strategy') return 'strategy';
  if (category === 'evidence') return 'evidence';

  const assetKind = `${objectType} ${title}`.toLowerCase();
  const isStructure =
    assetKind.includes('index') ||
    assetKind.includes('sector') ||
    assetKind.includes('theme') ||
    assetKind.includes('指数') ||
    assetKind.includes('行业') ||
    assetKind.includes('风格');

  return isStructure ? 'asset_structure' : 'asset_product';
}

export function layoutSemanticGraph(
  nodes: SemanticGraphNode[],
  _edges: SemanticGraphEdge[],
): SemanticGraphNode[] {
  const lanes = new Map<Lane, SemanticGraphNode[]>(
    laneOrder.map((lane) => [lane, []]),
  );

  nodes.forEach((node) => {
    lanes.get(getLane(node))?.push(node);
  });

  const columns: SemanticGraphNode[][] = [];
  laneOrder.forEach((lane) => {
    const items = lanes.get(lane) ?? [];
    for (let index = 0; index < items.length; index += MAX_ROWS) {
      columns.push(items.slice(index, index + MAX_ROWS));
    }
  });

  const positions = new Map<string, { x: number; y: number }>();
  columns.forEach((column, columnIndex) => {
    const yOffset = ((MAX_ROWS - column.length) * ROW_STEP) / 2;
    column.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: columnIndex * COLUMN_STEP,
        y: Math.round(yOffset + rowIndex * ROW_STEP),
      });
    });
  });

  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? node.position,
  }));
}
