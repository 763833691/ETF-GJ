import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import { useState } from 'react';

export function SemanticEdge(props: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath(props);
  const data = props.data as { highlighted?: boolean; dimmed?: boolean } | undefined;
  const stroke = data?.highlighted ? 'rgba(74, 139, 204, 0.72)' : 'rgba(86, 116, 160, 0.34)';
  const strokeWidth = data?.highlighted ? 2.1 : 1.25;
  const opacity = data?.dimmed ? 0.18 : 1;

  return (
    <>
      <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <BaseEdge
          path={edgePath}
          interactionWidth={22}
          style={{
            stroke,
            strokeWidth,
            opacity,
            filter: data?.highlighted ? 'drop-shadow(0 8px 12px rgba(74,139,204,0.16))' : undefined,
          }}
        />
      </g>
      {props.label && (hovered || props.selected || data?.highlighted) ? (
        <EdgeLabelRenderer>
          <div
            className="semantic-edge-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              opacity: data?.dimmed ? 0.18 : 1,
              pointerEvents: 'all',
            }}
          >
            {props.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
