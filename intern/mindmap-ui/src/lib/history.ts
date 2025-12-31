import { MindmapNode } from '@/types/mindmap';

export type HistoryAction = 
  | { type: 'UPDATE_NODE'; nodeId: string; oldNode: MindmapNode; newNode: MindmapNode }
  | { type: 'ADD_NODE'; nodeId: string; parentId: string | null; node: MindmapNode }
  | { type: 'DELETE_NODE'; nodeId: string; parentId: string | null; node: MindmapNode }
  | { type: 'MOVE_NODE'; nodeId: string; oldParentId: string | null; newParentId: string | null }
  | { type: 'EXPAND_NODE'; nodeId: string }
  | { type: 'COLLAPSE_NODE'; nodeId: string };

export interface HistoryState {
  past: HistoryAction[][];
  present: MindmapNode;
  future: HistoryAction[][];
}

export class HistoryManager {
  private state: HistoryState;
  private maxHistorySize: number;

  constructor(initialState: MindmapNode, maxHistorySize: number = 50) {
    this.state = {
      past: [],
      present: initialState,
      future: [],
    };
    this.maxHistorySize = maxHistorySize;
  }

  getCurrentState(): MindmapNode {
    return this.state.present;
  }

  canUndo(): boolean {
    return this.state.past.length > 0;
  }

  canRedo(): boolean {
    return this.state.future.length > 0;
  }

  addAction(actions: HistoryAction[]): void {
    // Clear future when new action is added
    this.state.future = [];
    
    // Add to past
    this.state.past.push(actions);
    
    // Limit history size
    if (this.state.past.length > this.maxHistorySize) {
      this.state.past.shift();
    }
  }

  updatePresent(newState: MindmapNode): void {
    this.state.present = newState;
  }

  undo(): MindmapNode | null {
    if (!this.canUndo()) {
      return null;
    }

    const actions = this.state.past.pop()!;
    this.state.future.push(actions);
    
    // Apply inverse actions
    let newState = { ...this.state.present };
    for (let i = actions.length - 1; i >= 0; i--) {
      newState = this.applyInverseAction(actions[i], newState);
    }
    
    this.state.present = newState;
    return newState;
  }

  redo(): MindmapNode | null {
    if (!this.canRedo()) {
      return null;
    }

    const actions = this.state.future.pop()!;
    this.state.past.push(actions);
    
    // Apply actions
    let newState = { ...this.state.present };
    for (const action of actions) {
      newState = this.applyAction(action, newState);
    }
    
    this.state.present = newState;
    return newState;
  }

  private applyAction(action: HistoryAction, state: MindmapNode): MindmapNode {
    switch (action.type) {
      case 'UPDATE_NODE':
        return this.updateNodeInTree([state], action.nodeId, action.newNode)[0];
      case 'ADD_NODE':
        return this.addNodeToTree([state], action.parentId, action.node)[0];
      case 'DELETE_NODE':
        return this.removeNodeFromTree([state], action.nodeId)[0];
      case 'MOVE_NODE':
        return this.moveNodeInTree([state], action.nodeId, action.newParentId)[0];
      default:
        return state;
    }
  }

  private applyInverseAction(action: HistoryAction, state: MindmapNode): MindmapNode {
    switch (action.type) {
      case 'UPDATE_NODE':
        return this.updateNodeInTree([state], action.nodeId, action.oldNode)[0];
      case 'ADD_NODE':
        return this.removeNodeFromTree([state], action.nodeId)[0];
      case 'DELETE_NODE':
        return this.addNodeToTree([state], action.parentId, action.node)[0];
      case 'MOVE_NODE':
        return this.moveNodeInTree([state], action.nodeId, action.oldParentId)[0];
      default:
        return state;
    }
  }

  private updateNodeInTree(nodes: MindmapNode[], nodeId: string, updates: MindmapNode): MindmapNode[] {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: this.updateNodeInTree(node.children, nodeId, updates)
        };
      }
      return node;
    });
  }

  private addNodeToTree(nodes: MindmapNode[], parentId: string | null, newNode: MindmapNode): MindmapNode[] {
    if (parentId === null) {
      return [...nodes, newNode];
    }
    return nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode]
        };
      }
      if (node.children) {
        return {
          ...node,
          children: this.addNodeToTree(node.children, parentId, newNode)
        };
      }
      return node;
    });
  }

  private removeNodeFromTree(nodes: MindmapNode[], nodeId: string): MindmapNode[] {
    return nodes
      .filter(node => node.id !== nodeId)
      .map(node => {
        if (node.children) {
          return {
            ...node,
            children: this.removeNodeFromTree(node.children, nodeId)
          };
        }
        return node;
      });
  }

  private moveNodeInTree(nodes: MindmapNode[], nodeId: string, newParentId: string | null): MindmapNode[] {
    // First, find and remove the node
    let nodeToMove: MindmapNode | null = null;
    const withoutNode = this.removeNodeFromTree(nodes, nodeId);
    
    // Find the node in original tree
    const findNode = (ns: MindmapNode[]): MindmapNode | null => {
      for (const node of ns) {
        if (node.id === nodeId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    nodeToMove = findNode(nodes);
    if (!nodeToMove) return withoutNode;
    
    // Add to new parent
    return this.addNodeToTree(withoutNode, newParentId, nodeToMove);
  }
}

