import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Card, CardContent, IconButton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, CloudUpload as UploadIcon } from '@mui/icons-material';

interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface ActionLogsSectionProps {
  actionLogStatus: string;
  uploadedDocuments: UploadedDocument[];
  packageData: {
    createdBy: string;
    createdAt: string;
  };
  onStatusChange: (status: string) => void;
  onOpenUploadModal: () => void;
  onRemoveDocument: (documentId: string) => void;
  onFileSelect?: (files: FileList) => void;
  isUploading?: boolean;
  isAdminChecked?: boolean;
  onAdminCheck?: (checked: boolean) => void;
}

const ActionLogsSection: React.FC<ActionLogsSectionProps> = ({
  actionLogStatus,
  uploadedDocuments,
  packageData,
  onStatusChange,
  onOpenUploadModal,
  onRemoveDocument,
  onFileSelect,
  isUploading = false,
  isAdminChecked = false,
  onAdminCheck
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

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
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Action Logs
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={onOpenUploadModal}
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              textTransform: 'none',
              borderRadius: 1
            }}
          >
            ADD
          </Button>
        </Box>

        {/* Action Log Entry */}
        <Box sx={{
          bgcolor: '#ffffff',
          p: 2,
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* Status Indicator - Clickable Checkbox */}
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: isAdminChecked ? '2px solid #22c55e' : '2px solid #ef4444',
                bgcolor: isAdminChecked ? '#22c55e' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 0.5,
                cursor: uploadedDocuments.length > 0 ? 'pointer' : 'not-allowed',
                opacity: uploadedDocuments.length > 0 ? 1 : 0.5,
                '&:hover': {
                  bgcolor: uploadedDocuments.length > 0
                    ? (isAdminChecked ? '#16a34a' : '#fef2f2')
                    : 'transparent'
                }
              }}
              onClick={() => {
                // Only allow clicking if documents are uploaded
                if (uploadedDocuments.length === 0 || !onAdminCheck) return;

                // Toggle admin check state
                const newCheckedState = !isAdminChecked;
                onAdminCheck(newCheckedState);

                // Update status based on admin check
                if (newCheckedState) {
                  // Admin checked - move to Ready to Send
                  onStatusChange('Ready to Send');
                } else {
                  // Admin unchecked - move back to In Review
                  onStatusChange('In Review');
                }
              }}
            >
              {isAdminChecked ? (
                <Box sx={{
                  width: 8,
                  height: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: 6,
                    height: 3,
                    borderLeft: '2px solid white',
                    borderBottom: '2px solid white',
                    transform: 'rotate(-45deg)',
                    marginTop: '-1px'
                  }} />
                </Box>
              ) : null}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                {actionLogStatus === 'Action Required' ? 'Missing Documents' : 
                 actionLogStatus === 'In Review' ? 'Documents Uploaded' : 
                 actionLogStatus === 'Ready to Send' ? 'Ready to Send' : 'Documents'}
              </Typography>

              <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.875rem' }}>
                {actionLogStatus === 'Action Required' ? 'Please upload item invoice' :
                 actionLogStatus === 'In Review' ? 'Documents are being reviewed' :
                 actionLogStatus === 'Ready to Send' ? 'Package is ready to be sent' : 'Upload item invoice'}
              </Typography>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {/* Show upload area only when no documents exist */}
              {uploadedDocuments.length === 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box
                    onClick={isUploading ? undefined : handleClick}
                    onDragOver={isUploading ? undefined : handleDragOver}
                    onDragLeave={isUploading ? undefined : handleDragLeave}
                    onDrop={isUploading ? undefined : handleDrop}
                    sx={{
                      border: `2px dashed ${isDragOver ? '#3b82f6' : '#d1d5db'}`,
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      bgcolor: isDragOver ? '#f0f9ff' : '#fafafa',
                      transition: 'all 0.2s ease-in-out',
                      opacity: isUploading ? 0.6 : 1,
                      '&:hover': {
                        borderColor: isUploading ? '#d1d5db' : '#3b82f6',
                        bgcolor: isUploading ? '#fafafa' : '#f0f9ff'
                      }
                    }}
                  >
                    {isUploading ? (
                      <>
                        <CircularProgress 
                          size={48} 
                          sx={{ 
                            color: '#3b82f6',
                            mb: 1
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                          Uploading files...
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          Please wait while your files are being uploaded
                        </Typography>
                      </>
                    ) : (
                      <>
                        <UploadIcon 
                          sx={{ 
                            fontSize: 48, 
                            color: isDragOver ? '#3b82f6' : '#9ca3af',
                            mb: 1
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                          {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          PNG, JPG, PDF up to 10MB
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              )}

              {/* Show document thumbnails when documents exist */}
              {uploadedDocuments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {uploadedDocuments.map((doc) => (
                      <Box key={doc.id} sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          sx={{
                            width: 80,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e9ecef',
                            cursor: 'pointer'
                          }}
                          alt={doc.name}
                          src={doc.url}
                          onClick={() => window.open(doc.url, '_blank')}
                        />
                        <IconButton
                          size="small"
                          onClick={() => onRemoveDocument(doc.id)}
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
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Add more button when documents exist */}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={isUploading ? <CircularProgress size={16} /> : <AddIcon />}
                    onClick={isUploading ? undefined : handleClick}
                    disabled={isUploading}
                    sx={{ mt: 1, fontSize: '0.75rem' }}
                  >
                    {isUploading ? 'Uploading...' : 'Add More Documents'}
                  </Button>
                </Box>
              )}

              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                {packageData.createdBy} {packageData.createdAt}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActionLogsSection;
