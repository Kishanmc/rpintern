'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Button,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Close, Edit, Home } from '@mui/icons-material';
import { MindmapNode } from '@/types/mindmap';

interface NodeDetailsPanelProps {
  node: MindmapNode;
  rootNode: MindmapNode;
  onEdit: (nodeId: string) => void;
  onClose: () => void;
  onNavigate?: (nodeId: string) => void;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  node,
  rootNode,
  onEdit,
  onClose,
  onNavigate,
}) => {
  // Get breadcrumb path
  const getBreadcrumbPath = (root: MindmapNode, targetId: string, path: MindmapNode[] = []): MindmapNode[] | null => {
    const currentPath = [...path, root];
    if (root.id === targetId) return currentPath;
    if (root.children) {
      for (const child of root.children) {
        const result = getBreadcrumbPath(child, targetId, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  const breadcrumbPath = getBreadcrumbPath(rootNode, node.id) || [];

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" component="h2">
          {node.title}
        </Typography>
        <Box>
          <IconButton onClick={() => onEdit(node.id)} size="small">
            <Edit />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Breadcrumbs */}
      {breadcrumbPath.length > 1 && (
        <Box mb={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbPath.map((crumb, index) => (
              <Link
                key={crumb.id}
                component="button"
                variant="body2"
                onClick={() => onNavigate?.(crumb.id)}
                sx={{
                  cursor: 'pointer',
                  textDecoration: index === breadcrumbPath.length - 1 ? 'none' : 'underline',
                  color: index === breadcrumbPath.length - 1 ? 'text.primary' : 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {index === 0 && <Home sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />}
                {crumb.title}
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      <Box mb={3}>
        <Typography variant="h6" gutterBottom color="primary">
          Summary
        </Typography>
        <Typography variant="body1" paragraph>
          {node.summary}
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6" gutterBottom color="primary">
          Description
        </Typography>
        <Typography variant="body1" paragraph>
          {node.description}
        </Typography>
      </Box>

      {/* Metadata */}
      {node.metadata && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom color="primary">
            Metadata
          </Typography>
          {node.metadata.status && (
            <Chip
              label={node.metadata.status}
              size="small"
              color={node.metadata.status === 'completed' ? 'success' : node.metadata.status === 'important' ? 'error' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
          )}
          {node.metadata.tags && node.metadata.tags.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Tags:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {node.metadata.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {node.children && node.children.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom color="primary">
            Children ({node.children.length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {node.children.map((child) => (
              <Chip
                key={child.id}
                label={child.title}
                size="small"
                variant="outlined"
                onClick={() => onNavigate?.(child.id)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => onEdit(node.id)}
          fullWidth
          sx={{ mb: 1 }}
        >
          Edit Full Details
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 1 }}>
          Tip: Double-click the node title to edit it quickly
        </Typography>
      </Box>
    </Box>
  );
};

export default NodeDetailsPanel;
