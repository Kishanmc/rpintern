import { Node } from 'reactflow';
import { MindmapNode } from '@/types/mindmap';

export interface NavigationState {
  currentNodeId: string | null;
  allNodeIds: string[];
  nodeMap: Map<string, Node>;
}

export function getNavigationNodes(nodes: Node[]): NavigationState {
  const nodeMap = new Map<string, Node>();
  const allNodeIds: string[] = [];

  nodes.forEach(node => {
    nodeMap.set(node.id, node);
    allNodeIds.push(node.id);
  });

  return {
    currentNodeId: null,
    allNodeIds,
    nodeMap,
  };
}

export function findNextNode(
  currentNodeId: string | null,
  nodes: Node[],
  direction: 'up' | 'down' | 'left' | 'right'
): string | null {
  if (!currentNodeId || nodes.length === 0) {
    return nodes[0]?.id || null;
  }

  const currentNode = nodes.find(n => n.id === currentNodeId);
  if (!currentNode) return nodes[0]?.id || null;

  const currentPos = currentNode.position;
  const currentWidth = (currentNode.width as number) || 200;
  const currentHeight = (currentNode.height as number) || 100;

  let closestNode: Node | null = null;
  let minDistance = Infinity;

  nodes.forEach(node => {
    if (node.id === currentNodeId) return;

    const nodePos = node.position;
    const nodeWidth = (node.width as number) || 200;
    const nodeHeight = (node.height as number) || 100;

    let distance = Infinity;
    let isInDirection = false;

    switch (direction) {
      case 'up':
        isInDirection = nodePos.y + nodeHeight < currentPos.y;
        if (isInDirection) {
          const horizontalOverlap = 
            Math.max(0, Math.min(currentPos.x + currentWidth, nodePos.x + nodeWidth) - 
                     Math.max(currentPos.x, nodePos.x));
          distance = currentPos.y - (nodePos.y + nodeHeight);
          // Prefer nodes with horizontal overlap
          if (horizontalOverlap > 0) {
            distance -= 1000; // Bias towards overlapping nodes
          }
        }
        break;
      case 'down':
        isInDirection = nodePos.y > currentPos.y + currentHeight;
        if (isInDirection) {
          const horizontalOverlap = 
            Math.max(0, Math.min(currentPos.x + currentWidth, nodePos.x + nodeWidth) - 
                     Math.max(currentPos.x, nodePos.x));
          distance = nodePos.y - (currentPos.y + currentHeight);
          if (horizontalOverlap > 0) {
            distance -= 1000;
          }
        }
        break;
      case 'left':
        isInDirection = nodePos.x + nodeWidth < currentPos.x;
        if (isInDirection) {
          const verticalOverlap = 
            Math.max(0, Math.min(currentPos.y + currentHeight, nodePos.y + nodeHeight) - 
                     Math.max(currentPos.y, nodePos.y));
          distance = currentPos.x - (nodePos.x + nodeWidth);
          if (verticalOverlap > 0) {
            distance -= 1000;
          }
        }
        break;
      case 'right':
        isInDirection = nodePos.x > currentPos.x + currentWidth;
        if (isInDirection) {
          const verticalOverlap = 
            Math.max(0, Math.min(currentPos.y + currentHeight, nodePos.y + nodeHeight) - 
                     Math.max(currentPos.y, nodePos.y));
          distance = nodePos.x - (currentPos.x + currentWidth);
          if (verticalOverlap > 0) {
            distance -= 1000;
          }
        }
        break;
    }

    if (isInDirection && distance < minDistance) {
      minDistance = distance;
      closestNode = node;
    }
  });

  return closestNode?.id || null;
}

export function getSiblingNodes(
  currentNodeId: string,
  nodes: Node[],
  mindmapData: MindmapNode
): string[] {
  // Find parent of current node
  const findParent = (root: MindmapNode, targetId: string, parent: MindmapNode | null = null): MindmapNode | null => {
    if (root.id === targetId) return parent;
    if (root.children) {
      for (const child of root.children) {
        const found = findParent(child, targetId, root);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const parent = findParent(mindmapData, currentNodeId);
  if (!parent || !parent.children) return [];

  return parent.children.map(child => child.id);
}

export function getChildNodes(
  currentNodeId: string,
  mindmapData: MindmapNode
): string[] {
  const node = findNodeById([mindmapData], currentNodeId);
  if (!node || !node.children) return [];
  return node.children.map(child => child.id);
}

function findNodeById(nodes: MindmapNode[], id: string): MindmapNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

