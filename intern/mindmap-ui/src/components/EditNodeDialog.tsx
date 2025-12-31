'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import { Add, Delete, Label } from '@mui/icons-material';
import { MindmapNode } from '@/types/mindmap';

interface EditNodeDialogProps {
  open: boolean;
  node: MindmapNode | null;
  onSave: (node: MindmapNode) => void;
  onCancel: () => void;
}

const EditNodeDialog: React.FC<EditNodeDialogProps> = ({
  open,
  node,
  onSave,
  onCancel,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'completed' | 'important' | 'archived'>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string }>>([]);

  useEffect(() => {
    if (node) {
      setTitle(node.title);
      setSummary(node.summary);
      setDescription(node.description);
      setStatus(node.metadata?.status || 'draft');
      setTags(node.metadata?.tags || []);
      setCustomFields(
        node.metadata?.customFields 
          ? Object.entries(node.metadata.customFields).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          : []
      );
    }
  }, [node]);

  const handleSave = () => {
    if (node) {
      const customFieldsObj: Record<string, string | number | boolean> = {};
      customFields.forEach(field => {
        if (field.key.trim()) {
          // Try to parse as number or boolean
          const numValue = Number(field.value);
          if (!isNaN(numValue) && field.value.trim() !== '') {
            customFieldsObj[field.key] = numValue;
          } else if (field.value === 'true' || field.value === 'false') {
            customFieldsObj[field.key] = field.value === 'true';
          } else {
            customFieldsObj[field.key] = field.value;
          }
        }
      });

      const updatedNode: MindmapNode = {
        ...node,
        title,
        summary,
        description,
        metadata: {
          status,
          tags: tags.filter(t => t.trim() !== ''),
          customFields: Object.keys(customFieldsObj).length > 0 ? customFieldsObj : undefined,
          updatedAt: new Date().toISOString(),
          createdAt: node.metadata?.createdAt || new Date().toISOString(),
        },
      };
      onSave(updatedNode);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const handleUpdateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: value };
    setCustomFields(updated);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!node) return null;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Edit Node</DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Basic" />
          <Tab label="Metadata" />
        </Tabs>
      </Box>
      <DialogContent>
        {tabValue === 0 && (
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
              helperText="Brief summary shown in tooltips and node preview"
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              variant="outlined"
              multiline
              rows={6}
              helperText="Detailed description shown in the side panel. Supports Markdown formatting."
            />
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as typeof status)}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="important">Important</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box display="flex" gap={1}>
                <TextField
                  size="small"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2">Custom Fields</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddCustomField}
                >
                  Add Field
                </Button>
              </Box>
              {customFields.map((field, index) => (
                <Paper key={index} sx={{ p: 2, mb: 1 }}>
                  <Box display="flex" gap={1} alignItems="center">
                    <TextField
                      size="small"
                      label="Key"
                      value={field.key}
                      onChange={(e) => handleUpdateCustomField(index, 'key', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Value"
                      value={field.value}
                      onChange={(e) => handleUpdateCustomField(index, 'value', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveCustomField(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
              {customFields.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No custom fields. Click "Add Field" to create one.
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!title.trim()}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNodeDialog;
