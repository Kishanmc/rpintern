'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, IconButton, Box, Tooltip, TextField } from '@mui/material';
import { ExpandMore, ExpandLess, Edit, Add, Delete } from '@mui/icons-material';

interface MindmapNodeData {
  label: string;
  title: string;
  summary: string;
  description: string;
  isExpanded: boolean;
  hasChildren: boolean;
  level: number;
  parentId?: string;
  onExpand?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  onAddChild?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onTitleUpdate?: (nodeId: string, newTitle: string) => void;
}

const MindmapNode: React.FC<NodeProps<MindmapNodeData>> = ({ data, selected, id }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTitle(data.title);
  }, [data.title]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onExpand?.(id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onEdit?.(id);
  };

  const handleAddChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onAddChild?.(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${data.title}" and all its children?`)) {
      data.onDelete?.(id);
    }
  };

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    if (editedTitle.trim() && editedTitle !== data.title) {
      data.onTitleUpdate?.(id, editedTitle.trim());
    } else {
      setEditedTitle(data.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(data.title);
      setIsEditingTitle(false);
    }
  };

  const getNodeColor = () => {
    const colors = [
      '#e3f2fd', // level 0 - blue
      '#f3e5f5', // level 1 - purple
      '#e8f5e8', // level 2 - green
      '#fff3e0', // level 3 - orange
      '#fce4ec', // level 4 - pink
    ];
    return colors[data.level % colors.length] || '#f5f5f5';
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Tooltip title={data.summary} arrow placement="top">
        <Card
          sx={{
            minWidth: 200,
            maxWidth: 300,
            backgroundColor: getNodeColor(),
            border: selected 
              ? '2px solid #1976d2' 
              : '1px solid rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            '&::before': selected ? {
              content: '""',
              position: 'absolute',
              inset: -4,
              borderRadius: 'inherit',
              padding: '2px',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animation: 'pulse 2s ease-in-out infinite',
            } : {},
            '&:hover': {
              boxShadow: selected 
                ? '0 8px 24px rgba(25, 118, 210, 0.4)' 
                : '0 4px 12px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)',
              borderColor: selected ? '#1976d2' : 'rgba(25, 118, 210, 0.5)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              {isEditingTitle ? (
                <TextField
                  inputRef={titleInputRef}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  variant="standard"
                  size="small"
                  sx={{ 
                    flexGrow: 1,
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      fontWeight: 600,
                      padding: '4px 0',
                    }
                  }}
                  autoFocus
                />
              ) : (
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1, 
                    fontSize: '1rem',
                    cursor: 'text',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.main',
                    }
                  }}
                  onDoubleClick={handleTitleDoubleClick}
                  title="Double-click to edit title"
                >
                  {data.title}
                </Typography>
              )}
              <Box display="flex" gap={0.5}>
                {selected && (
                  <>
                    <Tooltip title="Add Child Node" arrow>
                      <IconButton 
                        size="small" 
                        onClick={handleAddChildClick}
                        sx={{ 
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'primary.dark' },
                          width: 28,
                          height: 28,
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Node" arrow>
                      <IconButton 
                        size="small" 
                        onClick={handleDeleteClick}
                        sx={{ 
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                          width: 28,
                          height: 28,
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {data.hasChildren && (
                  <Tooltip title={data.isExpanded ? "Collapse" : "Expand"} arrow>
                    <IconButton 
                      size="small" 
                      onClick={handleExpandClick}
                      sx={{ 
                        backgroundColor: selected ? 'action.selected' : 'transparent',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      {data.isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Edit Details" arrow>
                  <IconButton 
                    size="small" 
                    onClick={handleEditClick}
                    sx={{ 
                      backgroundColor: selected ? 'action.selected' : 'transparent',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {data.summary && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {data.summary}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Tooltip>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default MindmapNode;
