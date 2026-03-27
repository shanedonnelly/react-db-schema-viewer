import { useMemo, useState, useCallback, memo } from "react";
import type { CSSProperties } from "react";
import {
  ReactFlow,
  Handle,
  Position,
  Background,
  Controls,
  applyNodeChanges,
} from "@xyflow/react";
import type { Node, Edge, NodeProps, NodeChange } from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";

// ─── Data structures ────────────────────────────────────────────────

export interface Attribute {
  name: string;
  type: string;
}

export interface Entity {
  id: string;
  name: string;
  attributes: Attribute[];
}

export interface Relation {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  label?: string;
}

export interface DataSchema {
  entities: Entity[];
  relations: Relation[];
}

// ─── JSON → DataSchema mapping ─────────────────────────────────────

/**
 * Maps a plain JSON object to the DataSchema TypeScript structure.
 * Expects the JSON to follow the same shape as DataSchema.
 */
export function mapJsonToDataSchema(json: unknown): DataSchema {
  const obj = json as Record<string, unknown>;
  const rawEntities = Array.isArray(obj.entities) ? obj.entities : [];
  const rawRelations = Array.isArray(obj.relations) ? obj.relations : [];

  const entities: Entity[] = rawEntities.map((e: Record<string, unknown>) => ({
    id: String(e.id ?? ""),
    name: String(e.name ?? ""),
    attributes: Array.isArray(e.attributes)
      ? e.attributes.map((a: Record<string, unknown>) => ({
          name: String(a.name ?? ""),
          type: String(a.type ?? ""),
        }))
      : [],
  }));

  const relations: Relation[] = rawRelations.map(
    (r: Record<string, unknown>) => ({
      id: String(r.id ?? ""),
      sourceEntityId: String(r.sourceEntityId ?? ""),
      targetEntityId: String(r.targetEntityId ?? ""),
      label: r.label != null ? String(r.label) : undefined,
    })
  );

  return { entities, relations };
}

// ─── Auto‑layout with dagre ────────────────────────────────────────

const NODE_WIDTH = 220;
const ROW_HEIGHT = 24;
const HEADER_HEIGHT = 36;
const PADDING_Y = 12;

function getNodeHeight(entity: Entity): number {
  return HEADER_HEIGHT + entity.attributes.length * ROW_HEIGHT + PADDING_Y;
}

function applyDagreLayout(
  entities: Entity[],
  relations: Relation[]
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 60, ranksep: 120 });

  for (const entity of entities) {
    g.setNode(entity.id, {
      width: NODE_WIDTH,
      height: getNodeHeight(entity),
    });
  }

  for (const rel of relations) {
    g.setEdge(rel.sourceEntityId, rel.targetEntityId);
  }

  dagre.layout(g);

  const nodes: Node[] = entities.map((entity) => {
    const pos = g.node(entity.id);
    return {
      id: entity.id,
      type: "entity",
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - getNodeHeight(entity) / 2,
      },
      data: { ...entity } as EntityNodeData,
    };
  });

  const edges: Edge[] = relations.map((rel) => ({
    id: rel.id,
    source: rel.sourceEntityId,
    target: rel.targetEntityId,
    label: rel.label,
    type: "default",
    markerEnd: { type: "arrowclosed" as const, color: "#6b7280" },
    style: { stroke: "#6b7280", strokeWidth: 1.5 },
    labelStyle: { fontSize: 11, fill: "#374151" },
  }));

  return { nodes, edges };
}

// ─── Custom entity node ────────────────────────────────────────────

const headerStyle: CSSProperties = {
  padding: "6px 12px",
  fontWeight: 600,
  fontSize: 13,
  background: "#4f46e5",
  color: "#fff",
  borderRadius: "6px 6px 0 0",
  letterSpacing: 0.3,
};

const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "3px 12px",
  fontSize: 12,
  borderBottom: "1px solid #f0f0f0",
};

const typeStyle: CSSProperties = {
  color: "#6b7280",
  fontStyle: "italic",
};

const containerStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  minWidth: NODE_WIDTH,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  fontFamily: "'Inter', system-ui, sans-serif",
};

type EntityNodeData = Entity & Record<string, unknown>;

const EntityNode = memo(({ data }: NodeProps<Node<EntityNodeData>>) => {
  return (
    <div style={containerStyle}>
      <Handle type="target" position={Position.Left} />
      <div style={headerStyle}>{data.name}</div>
      <div>
        {data.attributes.map((attr, i) => (
          <div key={i} style={rowStyle}>
            <span>{attr.name}</span>
            <span style={typeStyle}>{attr.type}</span>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

const nodeTypes = { entity: EntityNode };

// ─── Main component ────────────────────────────────────────────────

interface DataSchemaVisualizerProps {
  schema: DataSchema;
  style?: CSSProperties;
  className?: string;
}

export default function DataSchemaVisualizer({
  schema,
  style,
  className,
}: DataSchemaVisualizerProps) {
  const { nodes: initialNodes, edges } = useMemo(
    () => applyDagreLayout(schema.entities, schema.relations),
    [schema]
  );

  const [nodes, setNodes] = useState<Node[]>(initialNodes);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} color="#e5e7eb" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
