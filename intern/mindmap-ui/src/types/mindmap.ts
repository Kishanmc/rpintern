export interface MindmapNode {
  id: string;
  title: string;
  summary: string;
  description: string;
  children?: MindmapNode[];
  metadata?: {
    tags?: string[];
    status?: 'draft' | 'completed' | 'important' | 'archived';
    customFields?: Record<string, string | number | boolean>;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    title: string;
    summary: string;
    description: string;
    isExpanded: boolean;
    hasChildren: boolean;
    level: number;
    parentId?: string;
  };
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated?: boolean;
  style?: React.CSSProperties;
}
