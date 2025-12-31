'use client';

import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  ContentCopy,
  VerticalAlignCenter,
  HorizontalSplit,
} from '@mui/icons-material';
import { MindmapNode } from '@/types/mindmap';

interface ContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  node: MindmapNode | null;
  onAddChild: (nodeId: string) => void;
  onAddSibling: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  anchorEl,
  open,
  onClose,
  node,
  onAddChild,
  onAddSibling,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  if (!node) return null;

  const handleAddChild = () => {
    onAddChild(node.id);
    onClose();
  };

  const handleAddSibling = () => {
    onAddSibling(node.id);
    onClose();
  };

  const handleEdit = () => {
    onEdit(node.id);
    onClose();
  };

  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  const handleDuplicate = () => {
    onDuplicate(node.id);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={handleEdit}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit Node</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleAddChild}>
        <ListItemIcon>
          <Add fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add Child</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleAddSibling}>
        <ListItemIcon>
          <HorizontalSplit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add Sibling</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleDuplicate}>
        <ListItemIcon>
          <ContentCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText>Duplicate</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <Delete fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ContextMenu;

