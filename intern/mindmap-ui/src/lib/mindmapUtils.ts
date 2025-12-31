import { MindmapNode, ReactFlowNode, ReactFlowEdge } from '@/types/mindmap';

export function transformMindmapToReactFlow(
  mindmapData: MindmapNode,
  expandedNodes: Set<string> = new Set(['root']),
  onExpand?: (nodeId: string) => void,
  onEdit?: (nodeId: string) => void
): { nodes: ReactFlowNode[]; edges: ReactFlowEdge[] } {
  const nodes: ReactFlowNode[] = [];
  const edges: ReactFlowEdge[] = [];

  // Calculate total height needed for subtree
  function calculateSubtreeHeight(node: MindmapNode, expandedNodes: Set<string>): number {
    if (!expandedNodes.has(node.id) || !node.children || node.children.length === 0) {
      return 1;
    }
    let totalHeight = 0;
    node.children.forEach(child => {
      totalHeight += calculateSubtreeHeight(child, expandedNodes);
    });
    return Math.max(node.children.length, totalHeight);
  }

  function processNode(
    node: MindmapNode,
    x: number,
    y: number,
    level: number = 0,
    parentId?: string,
    subtreeHeight: number = 1
  ) {
    // Create React Flow node
    const rfNode: ReactFlowNode = {
      id: node.id,
      type: 'mindmapNode',
      position: { x, y },
      data: {
        label: node.title,
        title: node.title,
        summary: node.summary,
        description: node.description,
        isExpanded: expandedNodes.has(node.id),
        hasChildren: Boolean(node.children && node.children.length > 0),
        level,
        parentId,
        onExpand,
        onEdit,
        onAddChild: onExpand, // Will be overridden in component
        onDelete: onExpand, // Will be overridden in component
        onTitleUpdate: onExpand, // Will be overridden in component
      },
    };
    nodes.push(rfNode);

    // Process children if node is expanded and has children
    if (expandedNodes.has(node.id) && node.children && node.children.length > 0) {
      const horizontalSpacing = 300; // Increased spacing between levels
      const verticalSpacing = 180; // Spacing between siblings
      
      // Calculate total height needed for all children
      let totalChildrenHeight = 0;
      const childHeights: number[] = [];
      node.children.forEach(child => {
        const height = calculateSubtreeHeight(child, expandedNodes);
        childHeights.push(height);
        totalChildrenHeight += height;
      });

      // Center children vertically around parent
      let currentY = y - (totalChildrenHeight * verticalSpacing) / 2 + verticalSpacing / 2;

      node.children.forEach((child, index) => {
        const childHeight = childHeights[index];
        const childY = currentY + (childHeight * verticalSpacing) / 2 - verticalSpacing / 2;
        const childX = x + horizontalSpacing;

        // Create edge to child
        edges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
        });

        // Recursively process child
        processNode(child, childX, childY, level + 1, node.id, childHeight);
        
        // Move to next child position
        currentY += childHeight * verticalSpacing;
      });
    }
  }

  // Calculate root position to center the mindmap
  const rootHeight = calculateSubtreeHeight(mindmapData, expandedNodes);
  const rootY = rootHeight > 1 ? (rootHeight * 180) / 2 : 0;
  
  // Start processing from root, centered
  processNode(mindmapData, 100, rootY, 0, undefined, rootHeight);

  return { nodes, edges };
}

export function toggleNodeExpansion(
  nodeId: string,
  expandedNodes: Set<string>
): Set<string> {
  const newExpanded = new Set(expandedNodes);
  if (newExpanded.has(nodeId)) {
    newExpanded.delete(nodeId);
  } else {
    newExpanded.add(nodeId);
  }
  return newExpanded;
}

export function findNodeById(nodes: MindmapNode[], id: string): MindmapNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateNodeInTree(
  nodes: MindmapNode[],
  nodeId: string,
  updates: Partial<MindmapNode>
): MindmapNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeInTree(node.children, nodeId, updates)
      };
    }
    return node;
  });
}

export interface SearchResult {
  node: MindmapNode;
  path: string[];
}

export function searchNodes(
  nodes: MindmapNode[],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  function searchNode(node: MindmapNode, path: string[] = []): void {
    const currentPath = [...path, node.title];
    
    // Check if node matches search query
    const matchesTitle = node.title.toLowerCase().includes(lowerQuery);
    const matchesSummary = node.summary.toLowerCase().includes(lowerQuery);
    const matchesDescription = node.description.toLowerCase().includes(lowerQuery);

    if (matchesTitle || matchesSummary || matchesDescription) {
      results.push({
        node,
        path: currentPath,
      });
    }

    // Recursively search children
    if (node.children) {
      node.children.forEach(child => searchNode(child, currentPath));
    }
  }

  nodes.forEach(node => searchNode(node));
  return results;
}

export function getPathToNode(
  root: MindmapNode,
  targetId: string,
  path: string[] = []
): string[] | null {
  const currentPath = [...path, root.id];

  if (root.id === targetId) {
    return currentPath;
  }

  if (root.children) {
    for (const child of root.children) {
      const result = getPathToNode(child, targetId, currentPath);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

export function getBreadcrumbPath(
  root: MindmapNode,
  targetId: string,
  path: MindmapNode[] = []
): MindmapNode[] | null {
  const currentPath = [...path, root];

  if (root.id === targetId) {
    return currentPath;
  }

  if (root.children) {
    for (const child of root.children) {
      const result = getBreadcrumbPath(child, targetId, currentPath);
      if (result) {
        return result;
      }
    }
  }

  return null;
}