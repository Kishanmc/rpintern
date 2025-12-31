'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  IconButton,
} from '@mui/material';
import { Close, Add, Edit, Delete, ExpandMore } from '@mui/icons-material';

interface WelcomeGuideProps {
  open: boolean;
  onClose: () => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'Welcome!',
      description: 'Welcome to Interactive Mindmap UI. This guide will help you get started.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            A mindmap helps you organize ideas visually. Each box (node) can contain information and connect to other nodes.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Let's learn the basics in just a few steps!
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Click to Select',
      description: 'Click any node to select it and see details.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Click any node</strong> to select it. When selected:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">The node gets a blue border</Typography>
            <Typography component="li" variant="body2">Connected lines highlight</Typography>
            <Typography component="li" variant="body2">Details appear on the right</Typography>
          </Box>
        </Box>
      ),
    },
    {
      label: 'Add New Nodes',
      description: 'Create new nodes easily.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>To add a child node:</strong>
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">1. Click a node to select it</Typography>
            <Typography component="li" variant="body2">2. Click the green <Add /> button that appears</Typography>
            <Typography component="li" variant="body2">3. A new node appears below!</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You can also right-click any node for more options.
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Edit Node Title',
      description: 'Change node names quickly.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Double-click any node title</strong> to edit it directly.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Press Enter to save, or Escape to cancel.
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Edit Full Details',
      description: 'Add descriptions and more information.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Click the edit button</strong> <Edit fontSize="small" /> on any node to:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">Change title, summary, and description</Typography>
            <Typography component="li" variant="body2">Add tags for organization</Typography>
            <Typography component="li" variant="body2">Set status (draft, completed, etc.)</Typography>
            <Typography component="li" variant="body2">Add custom information</Typography>
          </Box>
        </Box>
      ),
    },
    {
      label: 'Delete Nodes',
      description: 'Remove nodes you don\'t need.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>To delete a node:</strong>
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">1. Select the node</Typography>
            <Typography component="li" variant="body2">2. Click the red <Delete /> button</Typography>
            <Typography component="li" variant="body2">3. Confirm deletion</Typography>
          </Box>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            ⚠️ Warning: Deleting a node also deletes all its children!
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Expand & Collapse',
      description: 'Show or hide child nodes.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Click the expand button</strong> <ExpandMore /> to show child nodes.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click again to hide them. This helps keep large mindmaps organized!
          </Typography>
        </Box>
      ),
    },
    {
      label: 'You\'re Ready!',
      description: 'Start creating your mindmap.',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>That's it!</strong> You now know the basics.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Quick Tips:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">Use the search bar to find nodes quickly</Typography>
            <Typography component="li" variant="body2">Right-click nodes for more options</Typography>
            <Typography component="li" variant="body2">Your work saves automatically</Typography>
            <Typography component="li" variant="body2">Press ? for keyboard shortcuts</Typography>
          </Box>
          <Typography variant="body2" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
            Happy mindmapping! 🎉
          </Typography>
        </Box>
      ),
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem('mindmap-welcome-shown', 'true');
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={handleSkip}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Getting Started Guide</Typography>
          <IconButton onClick={handleSkip} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'background.default' }}>
                  {step.content}
                </Paper>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you're ready to go!</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSkip}>Skip Guide</Button>
        {activeStep === steps.length && (
          <Button onClick={handleSkip} variant="contained">
            Get Started
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeGuide;

