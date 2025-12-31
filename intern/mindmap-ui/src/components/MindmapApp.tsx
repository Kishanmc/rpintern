'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
  useReactFlow,
} from 'reactflow';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Tooltip, 
  Fab,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Chip,
  Badge,
} from '@mui/material';
import { 
  CenterFocusStrong, 
  Search, 
  Clear, 
  DarkMode, 
  LightMode,
  Undo,
  Redo,
  Save,
  Download,
  FileDownload,
  Image,
  Code,
  Keyboard,
  Help,
  Add,
} from '@mui/icons-material';
import 'reactflow/dist/style.css';

import MindmapNode from './MindmapNode';
import NodeDetailsPanel from './NodeDetailsPanel';
import EditNodeDialog from './EditNodeDialog';
import ContextMenu from './ContextMenu';
import WelcomeGuide from './WelcomeGuide';
import mindmapData from '@/data/mindmap.json';
import { 
  transformMindmapToReactFlow, 
  toggleNodeExpansion, 
  findNodeById, 
  updateNodeInTree,
  searchNodes,
  getPathToNode,
  SearchResult,
} from '@/lib/mindmapUtils';
import { MindmapNode as MindmapNodeType } from '@/types/mindmap';
import { useThemeMode } from '@/lib/theme';
import { HistoryManager } from '@/lib/history';
import { saveToLocalStorage, loadFromLocalStorage, hasUnsavedChanges } from '@/lib/storage';
import { findNextNode, getSiblingNodes, getChildNodes } from '@/lib/keyboardNavigation';

const nodeTypes = {
  mindmapNode: MindmapNode,
};

const MindmapFlow: React.FC<{
  currentMindmapData: MindmapNodeType;
  expandedNodes: Set<string>;
  selectedNodeId: string | null;
  onNodeExpand: (nodeId: string) => void;
  onNodeEdit: (nodeId: string) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  reactFlowInstance: React.MutableRefObject<ReactFlowInstance | null>;
  onNodesUpdate?: (nodes: Node[]) => void;
  snapToGrid: boolean;
  themeMode: 'light' | 'dark';
  onAddChild?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onTitleUpdate?: (nodeId: string, newTitle: string) => void;
}> = ({ currentMindmapData, expandedNodes, selectedNodeId, onNodeExpand, onNodeEdit, onNodeClick, onNodeContextMenu, reactFlowInstance, onNodesUpdate, snapToGrid, themeMode, onAddChild, onDelete, onTitleUpdate }) => {
  const { fitView, getNode } = useReactFlow();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const result = transformMindmapToReactFlow(currentMindmapData, expandedNodes, onNodeExpand, onNodeEdit);
    // Handlers will be set in useEffect after component mounts
    return result;
  }, [currentMindmapData, expandedNodes, onNodeExpand, onNodeEdit]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update parent component with current nodes for keyboard navigation
  React.useEffect(() => {
    onNodesUpdate?.(nodes);
  }, [nodes, onNodesUpdate]);

  // Update nodes and edges when data changes
  React.useEffect(() => {
    const result = transformMindmapToReactFlow(currentMindmapData, expandedNodes, onNodeExpand, onNodeEdit);
    // Override node data with actual handlers
    const newNodes = result.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onAddChild: onAddChild,
        onDelete: onDelete,
        onTitleUpdate: onTitleUpdate,
      }
    }));
    setNodes(newNodes);
    setEdges(result.edges);
  }, [currentMindmapData, expandedNodes, setNodes, setEdges, onNodeExpand, onNodeEdit, onAddChild, onDelete, onTitleUpdate]);

  // Update edge styles based on selection
  const styledEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      animated: edge.source === selectedNodeId || edge.target === selectedNodeId,
      style: {
        stroke: edge.source === selectedNodeId || edge.target === selectedNodeId ? '#1976d2' : '#b1b1b7',
        strokeWidth: edge.source === selectedNodeId || edge.target === selectedNodeId ? 3 : 2,
      },
    }));
  }, [edges, selectedNodeId]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleFitView = useCallback(() => {
    fitView();
  }, [fitView]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodesConnectable={false}
        snapToGrid={snapToGrid}
        snapGrid={[20, 20]}
        fitView
        attributionPosition="bottom-left"
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
      >
        <Background 
          gap={20} 
          size={1}
          color={themeMode === 'dark' ? '#424242' : '#e0e0e0'}
        />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.selected) return '#1976d2';
            const level = node.data?.level || 0;
            const colors = ['#90caf9', '#ce93d8', '#a5d6a7', '#ffcc80', '#f48fb1'];
            return colors[level % colors.length] || '#e0e0e0';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
      <Tooltip title="Fit to View">
        <Fab
          color="primary"
          size="small"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={handleFitView}
        >
          <CenterFocusStrong />
        </Fab>
      </Tooltip>
    </>
  );
};

const MindmapApp: React.FC = () => {
  const { mode, toggleMode } = useThemeMode();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editNode, setEditNode] = useState<MindmapNodeType | null>(null);
  
  // Initialize with localStorage or default data
  const initialData = useMemo(() => {
    if (typeof window !== 'undefined') {
      const saved = loadFromLocalStorage();
      return saved || mindmapData;
    }
    return mindmapData;
  }, []);
  
  const [currentMindmapData, setCurrentMindmapData] = useState<MindmapNodeType>(initialData);
  const [dataVersion, setDataVersion] = useState<number>(Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null);
  const [contextMenuNode, setContextMenuNode] = useState<MindmapNodeType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [welcomeGuideOpen, setWelcomeGuideOpen] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Check if welcome guide should be shown
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const welcomeShown = localStorage.getItem('mindmap-welcome-shown');
      if (!welcomeShown) {
        setTimeout(() => setWelcomeGuideOpen(true), 1000);
      }
    }
  }, []);
  
  // Initialize history manager
  const historyManagerRef = useRef<HistoryManager>(
    new HistoryManager(currentMindmapData)
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleNodeExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => toggleNodeExpansion(nodeId, prev));
  }, []);

  const handleNodeEdit = useCallback((nodeId: string) => {
    const node = findNodeById([currentMindmapData], nodeId);
    if (node) {
      setEditNode(node);
      setEditDialogOpen(true);
    }
  }, [currentMindmapData]);

  const handleEditSave = useCallback((updatedNode: MindmapNodeType) => {
    const oldNode = findNodeById([currentMindmapData], updatedNode.id);
    if (oldNode) {
      historyManagerRef.current.addAction([{
        type: 'UPDATE_NODE',
        nodeId: updatedNode.id,
        oldNode,
        newNode: updatedNode,
      }]);
    }
    
    const newData = updateNodeInTree([currentMindmapData], updatedNode.id, updatedNode)[0];
    setCurrentMindmapData(newData);
    historyManagerRef.current.updatePresent(newData);
    setDataVersion(Date.now());
    setEditDialogOpen(false);
    setEditNode(null);
  }, [currentMindmapData]);

  const handleEditCancel = useCallback(() => {
    setEditDialogOpen(false);
    setEditNode(null);
  }, []);

  const selectedNodeData = selectedNodeId ? findNodeById([currentMindmapData], selectedNodeId) : null;

  // Handle search
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchNodes([currentMindmapData], query);
      setSearchResults(results);
      setSearchAnchorEl(event.currentTarget);
    } else {
      setSearchResults([]);
      setSearchAnchorEl(null);
    }
  }, [currentMindmapData]);

  const handleSearchResultClick = useCallback((result: SearchResult) => {
    const nodeId = result.node.id;
    
    // Expand all parent nodes to reveal the target node
    const path = getPathToNode(currentMindmapData, nodeId);
    if (path) {
      const newExpanded = new Set(expandedNodes);
      // Expand all nodes in the path except the target itself
      path.slice(0, -1).forEach(id => newExpanded.add(id));
      setExpandedNodes(newExpanded);
      
      // Wait for nodes to render, then focus and select
      setTimeout(() => {
        if (reactFlowInstance.current) {
          const node = reactFlowInstance.current.getNode(nodeId);
          if (node) {
            reactFlowInstance.current.fitView({ nodes: [node], duration: 500, padding: 0.2 });
            setSelectedNodeId(nodeId);
          }
        }
      }, 200);
    }
    
    setSearchQuery('');
    setSearchResults([]);
    setSearchAnchorEl(null);
  }, [currentMindmapData, expandedNodes]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchAnchorEl(null);
  }, []);

  const searchOpen = Boolean(searchAnchorEl) && searchResults.length > 0;

  // Autosave to localStorage
  React.useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(currentMindmapData);
    }, 1000); // Debounce autosave
    
    return () => clearTimeout(timer);
  }, [currentMindmapData]);

  // Get current nodes for keyboard navigation
  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);

  // Keyboard shortcuts and navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      } else if (selectedNodeId && reactFlowNodes.length > 0) {
        // Arrow key navigation
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const direction = 
            e.key === 'ArrowUp' ? 'up' :
            e.key === 'ArrowDown' ? 'down' :
            e.key === 'ArrowLeft' ? 'left' : 'right';
          
          const nextNodeId = findNextNode(selectedNodeId, reactFlowNodes, direction);
          if (nextNodeId) {
            setSelectedNodeId(nextNodeId);
            // Expand parent if needed and focus
            const path = getPathToNode(currentMindmapData, nextNodeId);
            if (path) {
              const newExpanded = new Set(expandedNodes);
              path.slice(0, -1).forEach(id => newExpanded.add(id));
              setExpandedNodes(newExpanded);
              setTimeout(() => {
                if (reactFlowInstance.current) {
                  const node = reactFlowInstance.current.getNode(nextNodeId);
                  if (node) {
                    reactFlowInstance.current.fitView({ nodes: [node], duration: 300, padding: 0.2 });
                  }
                }
              }, 100);
            }
          }
        } else if (e.key === 'Enter' && selectedNodeId) {
          // Expand/collapse on Enter
          e.preventDefault();
          handleNodeExpand(selectedNodeId);
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          // Delete node
          e.preventDefault();
          if (selectedNodeId && selectedNodeId !== 'root') {
            handleDeleteNode(selectedNodeId);
          }
        } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey) {
          // Edit node
          e.preventDefault();
          if (selectedNodeId) {
            handleNodeEdit(selectedNodeId);
          }
        } else if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
          // Add child
          e.preventDefault();
          if (selectedNodeId) {
            handleAddChild(selectedNodeId);
          }
        } else if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
          // Show help
          e.preventDefault();
          setHelpDialogOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, reactFlowNodes, currentMindmapData, expandedNodes]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const newState = historyManagerRef.current.undo();
    if (newState) {
      setCurrentMindmapData(newState);
      setDataVersion(Date.now());
    }
  }, []);

  const handleRedo = useCallback(() => {
    const newState = historyManagerRef.current.redo();
    if (newState) {
      setCurrentMindmapData(newState);
      setDataVersion(Date.now());
    }
  }, []);

  const handleManualSave = useCallback(() => {
    saveToLocalStorage(currentMindmapData);
    setDataVersion(Date.now());
  }, [currentMindmapData]);

  // Context menu handlers
  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    const nodeData = findNodeById([currentMindmapData], node.id);
    if (nodeData) {
      setContextMenuNode(nodeData);
      setContextMenuAnchor(event.currentTarget as HTMLElement);
    }
  }, [currentMindmapData]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuAnchor(null);
    setContextMenuNode(null);
  }, []);

  // Node management functions
  const generateNodeId = useCallback(() => {
    return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const handleAddChild = useCallback((parentId: string) => {
    const newNode: MindmapNodeType = {
      id: generateNodeId(),
      title: 'New Child Node',
      summary: '',
      description: '',
    };

    const findAndAddChild = (nodes: MindmapNodeType[]): MindmapNodeType[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: findAndAddChild(node.children),
          };
        }
        return node;
      });
    };

    const newData = findAndAddChild([currentMindmapData])[0];
    setCurrentMindmapData(newData);
    historyManagerRef.current.addAction([{
      type: 'ADD_NODE',
      nodeId: newNode.id,
      parentId,
      node: newNode,
    }]);
    historyManagerRef.current.updatePresent(newData);
    setDataVersion(Date.now());
    
    // Expand parent and select new node
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.add(parentId);
      return newSet;
    });
    setTimeout(() => setSelectedNodeId(newNode.id), 100);
  }, [currentMindmapData, generateNodeId]);

  const handleAddSibling = useCallback((nodeId: string) => {
    const node = findNodeById([currentMindmapData], nodeId);
    if (!node) return;

    // Find parent
    const findParent = (nodes: MindmapNodeType[], targetId: string, parent: MindmapNodeType | null = null): MindmapNodeType | null => {
      for (const n of nodes) {
        if (n.id === targetId) return parent;
        if (n.children) {
          const found = findParent(n.children, targetId, n);
          if (found !== null) return found;
        }
      }
      return null;
    };

    const parent = findParent([currentMindmapData], nodeId);
    const newNode: MindmapNodeType = {
      id: generateNodeId(),
      title: 'New Sibling Node',
      summary: '',
      description: '',
    };

    if (parent) {
      const findAndAddSibling = (nodes: MindmapNodeType[]): MindmapNodeType[] => {
        return nodes.map(n => {
          if (n.id === parent.id) {
            const index = n.children?.findIndex(c => c.id === nodeId) ?? -1;
            const newChildren = [...(n.children || [])];
            newChildren.splice(index + 1, 0, newNode);
            return { ...n, children: newChildren };
          }
          if (n.children) {
            return { ...n, children: findAndAddSibling(n.children) };
          }
          return n;
        });
      };
      const newData = findAndAddSibling([currentMindmapData])[0];
      setCurrentMindmapData(newData);
      historyManagerRef.current.addAction([{
        type: 'ADD_NODE',
        nodeId: newNode.id,
        parentId: parent.id,
        node: newNode,
      }]);
      historyManagerRef.current.updatePresent(newData);
      setDataVersion(Date.now());
      setTimeout(() => setSelectedNodeId(newNode.id), 100);
    }
  }, [currentMindmapData, generateNodeId]);

  const handleTitleUpdate = useCallback((nodeId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    const node = findNodeById([currentMindmapData], nodeId);
    if (!node) return;

    const oldNode = { ...node };
    const updatedNode = { ...node, title: newTitle.trim() };
    
    historyManagerRef.current.addAction([{
      type: 'UPDATE_NODE',
      nodeId,
      oldNode,
      newNode: updatedNode,
    }]);

    const newData = updateNodeInTree([currentMindmapData], nodeId, updatedNode)[0];
    setCurrentMindmapData(newData);
    historyManagerRef.current.updatePresent(newData);
    setDataVersion(Date.now());
  }, [currentMindmapData]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (nodeId === 'root') {
      alert('Cannot delete root node');
      return;
    }
    setNodeToDelete(nodeId);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!nodeToDelete) return;

    const node = findNodeById([currentMindmapData], nodeToDelete);
    if (!node) return;

    const findParent = (nodes: MindmapNodeType[], targetId: string): { parent: MindmapNodeType | null; index: number } => {
      for (const n of nodes) {
        if (n.children) {
          const index = n.children.findIndex(c => c.id === targetId);
          if (index !== -1) return { parent: n, index };
          const result = findParent(n.children, targetId);
          if (result.parent) return result;
        }
      }
      return { parent: null, index: -1 };
    };

    const { parent } = findParent([currentMindmapData], nodeToDelete);

    const removeNode = (nodes: MindmapNodeType[]): MindmapNodeType[] => {
      return nodes
        .filter(n => n.id !== nodeToDelete)
        .map(n => ({
          ...n,
          children: n.children ? removeNode(n.children) : undefined,
        }));
    };

    const newData = removeNode([currentMindmapData])[0];
    setCurrentMindmapData(newData);
    historyManagerRef.current.addAction([{
      type: 'DELETE_NODE',
      nodeId: nodeToDelete,
      parentId: parent?.id || null,
      node,
    }]);
    historyManagerRef.current.updatePresent(newData);
    setDataVersion(Date.now());
    setDeleteConfirmOpen(false);
    setNodeToDelete(null);
    if (selectedNodeId === nodeToDelete) {
      setSelectedNodeId(null);
    }
  }, [nodeToDelete, currentMindmapData, selectedNodeId]);

  const handleDuplicate = useCallback((nodeId: string) => {
    const node = findNodeById([currentMindmapData], nodeId);
    if (!node) return;

    const duplicateNode = (n: MindmapNodeType): MindmapNodeType => {
      return {
        ...n,
        id: generateNodeId(),
        title: `${n.title} (Copy)`,
        children: n.children?.map(child => duplicateNode(child)),
      };
    };

    const duplicated = duplicateNode(node);
    
    // Find parent and add as child
    const findParent = (nodes: MindmapNodeType[], targetId: string, parent: MindmapNodeType | null = null): MindmapNodeType | null => {
      for (const n of nodes) {
        if (n.id === targetId) return parent;
        if (n.children) {
          const found = findParent(n.children, targetId, n);
          if (found !== null) return found;
        }
      }
      return null;
    };

    const parent = findParent([currentMindmapData], nodeId);
    if (parent) {
      const findAndAddChild = (nodes: MindmapNodeType[]): MindmapNodeType[] => {
        return nodes.map(n => {
          if (n.id === parent.id) {
            return {
              ...n,
              children: [...(n.children || []), duplicated],
            };
          }
          if (n.children) {
            return {
              ...n,
              children: findAndAddChild(n.children),
            };
          }
          return n;
        });
      };
      const newData = findAndAddChild([currentMindmapData])[0];
      setCurrentMindmapData(newData);
      historyManagerRef.current.addAction([{
        type: 'ADD_NODE',
        nodeId: duplicated.id,
        parentId: parent.id,
        node: duplicated,
      }]);
      historyManagerRef.current.updatePresent(newData);
      setDataVersion(Date.now());
      setTimeout(() => setSelectedNodeId(duplicated.id), 100);
    }
  }, [currentMindmapData, generateNodeId]);

  // Export functions
  const handleExportJSON = useCallback(() => {
    const dataStr = JSON.stringify(currentMindmapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [currentMindmapData]);

  const handleExportPNG = useCallback(() => {
    if (!reactFlowInstance.current) return;
    
    const nodesBounds = reactFlowInstance.current.getNodes().reduce(
      (acc, node) => {
        const x = node.position.x;
        const y = node.position.y;
        const width = node.width || 200;
        const height = node.height || 100;
        
        return {
          minX: Math.min(acc.minX, x),
          minY: Math.min(acc.minY, y),
          maxX: Math.max(acc.maxX, x + width),
          maxY: Math.max(acc.maxY, y + height),
        };
      },
      { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    );

    const viewport = reactFlowInstance.current.getViewport();
    const width = nodesBounds.maxX - nodesBounds.minX + 100;
    const height = nodesBounds.maxY - nodesBounds.minY + 100;

    // PNG export requires html2canvas or similar library
    // For now, show a message that JSON export is available
    alert('PNG export functionality requires additional setup. JSON export is available.');
  }, []);

  const unsavedChanges = hasUnsavedChanges(dataVersion);

  return (
    <ReactFlowProvider>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Interactive Mindmap
            </Typography>
            
            {/* Undo/Redo */}
            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <IconButton 
                  color="inherit" 
                  onClick={handleUndo}
                  disabled={!historyManagerRef.current.canUndo()}
                >
                  <Undo />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)">
              <span>
                <IconButton 
                  color="inherit" 
                  onClick={handleRedo}
                  disabled={!historyManagerRef.current.canRedo()}
                >
                  <Redo />
                </IconButton>
              </span>
            </Tooltip>

            {/* Save */}
            <Tooltip title="Save (Ctrl+S)">
              <IconButton color="inherit" onClick={handleManualSave}>
                <Badge color="error" variant="dot" invisible={!unsavedChanges}>
                  <Save />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Add New Root Node */}
            <Tooltip title="Add New Root Node">
              <IconButton 
                color="inherit" 
                onClick={() => {
                  const newNode: MindmapNodeType = {
                    id: generateNodeId(),
                    title: 'New Root Node',
                    summary: '',
                    description: '',
                  };
                  // For now, we'll add it as a child of root, but you can modify to add as separate graph
                  handleAddChild('root');
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>

            {/* Export */}
            <Tooltip title="Export">
              <IconButton color="inherit" onClick={handleExportJSON}>
                <Download />
              </IconButton>
            </Tooltip>

            {/* Snap to Grid Toggle */}
            <Tooltip title={`${snapToGrid ? 'Disable' : 'Enable'} Snap to Grid`}>
              <IconButton 
                color="inherit" 
                onClick={() => setSnapToGrid(!snapToGrid)}
                sx={{ 
                  backgroundColor: snapToGrid ? 'rgba(255, 255, 255, 0.1)' : 'transparent' 
                }}
              >
                <Keyboard />
              </IconButton>
            </Tooltip>

            {/* Help / Keyboard Shortcuts */}
            <Tooltip title="Keyboard Shortcuts (?)">
              <IconButton color="inherit" onClick={() => setHelpDialogOpen(true)}>
                <Help />
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton color="inherit" onClick={toggleMode}>
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>
            <Box sx={{ position: 'relative', width: 300 }}>
              <TextField
                inputRef={searchInputRef}
                size="small"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
              <Popper
                open={searchOpen}
                anchorEl={searchAnchorEl}
                placement="bottom-start"
                sx={{ zIndex: 1300, width: searchAnchorEl?.clientWidth }}
              >
                <ClickAwayListener onClickAway={handleClearSearch}>
                  <Paper sx={{ maxHeight: 400, overflow: 'auto', mt: 1 }}>
                    <List dense>
                      {searchResults.map((result, index) => (
                        <ListItem key={result.node.id} disablePadding>
                          <ListItemButton onClick={() => handleSearchResultClick(result)}>
                            <ListItemText
                              primary={result.node.title}
                              secondary={result.path.join(' → ')}
                              primaryTypographyProps={{
                                sx: { fontWeight: 'medium' }
                              }}
                              secondaryTypographyProps={{
                                sx: { fontSize: '0.75rem', color: 'text.secondary' }
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <MindmapFlow
            currentMindmapData={currentMindmapData}
            expandedNodes={expandedNodes}
            selectedNodeId={selectedNodeId}
            onNodeExpand={handleNodeExpand}
            onNodeEdit={handleNodeEdit}
            onNodeClick={onNodeClick}
            onNodeContextMenu={handleNodeContextMenu}
            reactFlowInstance={reactFlowInstance}
            onNodesUpdate={setReactFlowNodes}
            snapToGrid={snapToGrid}
            themeMode={mode}
            onAddChild={handleAddChild}
            onDelete={handleDeleteNode}
            onTitleUpdate={handleTitleUpdate}
          />
        </Box>

        <Drawer
          anchor="right"
          open={Boolean(selectedNodeId)}
          onClose={() => setSelectedNodeId(null)}
          sx={{
            width: 400,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 400,
              boxSizing: 'border-box',
            },
          }}
        >
          {selectedNodeData && (
            <NodeDetailsPanel
              node={selectedNodeData}
              rootNode={currentMindmapData}
              onEdit={handleNodeEdit}
              onClose={() => setSelectedNodeId(null)}
              onNavigate={(nodeId) => {
                setSelectedNodeId(nodeId);
                const path = getPathToNode(currentMindmapData, nodeId);
                if (path) {
                  const newExpanded = new Set(expandedNodes);
                  path.slice(0, -1).forEach(id => newExpanded.add(id));
                  setExpandedNodes(newExpanded);
                  setTimeout(() => {
                    if (reactFlowInstance.current) {
                      const node = reactFlowInstance.current.getNode(nodeId);
                      if (node) {
                        reactFlowInstance.current.fitView({ nodes: [node], duration: 500, padding: 0.2 });
                      }
                    }
                  }, 200);
                }
              }}
            />
          )}
        </Drawer>

        <EditNodeDialog
          open={editDialogOpen}
          node={editNode}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />

        {/* Context Menu */}
        <ContextMenu
          anchorEl={contextMenuAnchor}
          open={Boolean(contextMenuAnchor)}
          onClose={handleCloseContextMenu}
          node={contextMenuNode}
          onAddChild={handleAddChild}
          onAddSibling={handleAddSibling}
          onEdit={handleNodeEdit}
          onDelete={handleDeleteNode}
          onDuplicate={handleDuplicate}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Delete Node?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this node? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Keyboard Shortcuts Help Dialog */}
        <Dialog
          open={helpDialogOpen}
          onClose={() => setHelpDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Typography variant="h6" gutterBottom>Navigation</Typography>
              <Box component="dl" sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>Arrow Keys</strong></Typography>
                  <Typography component="dd" variant="body2">Navigate between nodes</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>Enter</strong></Typography>
                  <Typography component="dd" variant="body2">Expand/Collapse node</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>E</strong></Typography>
                  <Typography component="dd" variant="body2">Edit selected node</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>N</strong></Typography>
                  <Typography component="dd" variant="body2">Add child node</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>Delete / Backspace</strong></Typography>
                  <Typography component="dd" variant="body2">Delete selected node</Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>Actions</Typography>
              <Box component="dl" sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>Ctrl+Z</strong></Typography>
                  <Typography component="dd" variant="body2">Undo</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>Ctrl+Y</strong></Typography>
                  <Typography component="dd" variant="body2">Redo</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>Ctrl+S</strong></Typography>
                  <Typography component="dd" variant="body2">Save</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography component="dt" variant="body2"><strong>?</strong></Typography>
                  <Typography component="dd" variant="body2">Show this help</Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Right-click on nodes for context menu with more options.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Welcome Guide */}
        <WelcomeGuide
          open={welcomeGuideOpen}
          onClose={() => {
            setWelcomeGuideOpen(false);
            localStorage.setItem('mindmap-welcome-shown', 'true');
          }}
        />
      </Box>
    </ReactFlowProvider>
  );
};

export default MindmapApp;
