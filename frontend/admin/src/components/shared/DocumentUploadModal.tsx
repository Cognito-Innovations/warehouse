import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DocumentUploadModalProps {
  open: boolean;
  selectedFiles: File[];
  onClose: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  title?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  open,
  selectedFiles,
  onClose,
  onFileSelect,
  onUpload,
  title = "Upload Documents",
  maxFiles = 10,
  maxFileSize = 10
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2,
        fontWeight: 600,
        color: '#1e293b'
      }}>
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            Selected File(s) [{selectedFiles.length}/{maxFiles}]
          </Typography>
          <Typography variant="body2" sx={{ color: '#3b82f6', fontSize: '0.875rem' }}>
            Maximum per file size is {maxFileSize}MB
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
            Supported formats: Images (JPEG, PNG, GIF) and PDFs
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={onFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              disabled={selectedFiles.length >= maxFiles}
              sx={{
                bgcolor: '#8b5cf6',
                '&:hover': { bgcolor: '#7c3aed' },
                textTransform: 'none',
                borderRadius: 1,
                px: 3
              }}
            >
              Select File(s)
            </Button>
          </label>

          <Button
            variant="contained"
            onClick={onUpload}
            disabled={selectedFiles.length === 0}
            sx={{
              bgcolor: selectedFiles.length > 0 ? '#3b82f6' : '#9ca3af',
              '&:hover': {
                bgcolor: selectedFiles.length > 0 ? '#2563eb' : '#9ca3af'
              },
              textTransform: 'none',
              borderRadius: 1,
              px: 3
            }}
          >
            Upload
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onUpload}
          disabled={selectedFiles.length === 0}
          sx={{
            bgcolor: selectedFiles.length > 0 ? '#3b82f6' : '#9ca3af',
            '&:hover': {
              bgcolor: selectedFiles.length > 0 ? '#2563eb' : '#9ca3af'
            },
            textTransform: 'none',
            borderRadius: 1,
            px: 3
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploadModal;
