import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Box, CircularProgress } from '@mui/material';
import { Close as CloseIcon, CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface UploadModalProps {
  open: boolean;
  selectedFiles: File[];
  onClose: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onRemoveFile: (index: number) => void;
  isUploading?: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({
  open,
  selectedFiles,
  onClose,
  onFileSelect,
  onUpload,
  onRemoveFile,
  isUploading = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Create a synthetic event to match the expected interface
      const syntheticEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      onFileSelect(syntheticEvent);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };
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
        pb: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Upload Documents
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={onFileSelect}
          style={{ display: 'none' }}
        />

        {/* Modern Upload Area */}
        <Box
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${isDragOver ? '#3b82f6' : '#d1d5db'}`,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragOver ? '#f0f9ff' : '#fafafa',
            transition: 'all 0.2s ease-in-out',
            mb: 3,
            '&:hover': {
              borderColor: '#3b82f6',
              bgcolor: '#f0f9ff'
            }
          }}
        >
          <UploadIcon 
            sx={{ 
              fontSize: 64, 
              color: isDragOver ? '#3b82f6' : '#9ca3af',
              mb: 2
            }} 
          />
          <Typography variant="h6" sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
            {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
            PNG, JPG, PDF up to 10MB
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            Multiple files supported
          </Typography>
        </Box>

        {/* File Previews */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#374151', mb: 2, fontWeight: 500 }}>
              Selected Files ({selectedFiles.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {selectedFiles.map((file, index) => {
                const preview = getFilePreview(file);
                return (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: 1,
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f9fafb'
                      }}
                    >
                      {preview ? (
                        <Box
                          component="img"
                          src={preview}
                          alt={file.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Typography variant="caption" sx={{ color: '#6b7280', textAlign: 'center', px: 1 }}>
                          {file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => onRemoveFile(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 20,
                        height: 20,
                        bgcolor: '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' },
                        '& .MuiSvgIcon-root': { fontSize: 12 }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      textAlign: 'center', 
                      mt: 0.5, 
                      color: '#6b7280',
                      maxWidth: 80,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isUploading}
          sx={{ textTransform: 'none', borderRadius: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onUpload}
          disabled={selectedFiles.length === 0 || isUploading}
          sx={{
            bgcolor: selectedFiles.length > 0 && !isUploading ? '#3b82f6' : '#9ca3af',
            '&:hover': {
              bgcolor: selectedFiles.length > 0 && !isUploading ? '#2563eb' : '#9ca3af'
            },
            textTransform: 'none',
            borderRadius: 1,
            px: 3,
            minWidth: 100
          }}
        >
          {isUploading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} sx={{ color: 'white' }} />
              Uploading...
            </Box>
          ) : (
            'Upload'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;
