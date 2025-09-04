import React from 'react';
import { Box, Typography, Button, Card, CardContent, IconButton } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

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
}

const ActionLogsSection: React.FC<ActionLogsSectionProps> = ({
  actionLogStatus,
  uploadedDocuments,
  packageData,
  onStatusChange,
  onOpenUploadModal,
  onRemoveDocument
}) => {
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
                border: actionLogStatus === 'In Review' ? '2px solid #22c55e' : '2px solid #ef4444',
                bgcolor: actionLogStatus === 'In Review' ? '#22c55e' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 0.5,
                cursor: uploadedDocuments.length > 0 ? 'pointer' : 'not-allowed',
                opacity: uploadedDocuments.length > 0 ? 1 : 0.5,
                '&:hover': {
                  bgcolor: uploadedDocuments.length > 0
                    ? (actionLogStatus === 'In Review' ? '#16a34a' : '#fef2f2')
                    : 'transparent'
                }
              }}
              onClick={() => {
                // Only allow clicking if documents are uploaded
                if (uploadedDocuments.length === 0) return;

                if (actionLogStatus === 'Action Required') {
                  onStatusChange('In Review');
                } else {
                  onStatusChange('Action Required');
                }
              }}
            >
              {actionLogStatus === 'In Review' ? (
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Missing Documents
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#8b5cf6',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.875rem'
                  }}
                >
                  Edit
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.875rem' }}>
                Please upload item invoice
              </Typography>

              {/* Document Previews */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {uploadedDocuments.map((doc) => (
                  <Box key={doc.id} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      sx={{
                        width: 60,
                        height: 45,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #e9ecef'
                      }}
                      alt={doc.name}
                      src={doc.url}
                    />
                    <IconButton
                      size="small"
                      onClick={() => onRemoveDocument(doc.id)}
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 16,
                        height: 16,
                        bgcolor: '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' },
                        '& .MuiSvgIcon-root': { fontSize: 10 }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}

                {/* Add Document Button */}
                <Box
                  sx={{
                    width: 60,
                    height: 45,
                    bgcolor: '#f8f9fa',
                    borderRadius: 1,
                    border: '1px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#e9ecef' }
                  }}
                  onClick={onOpenUploadModal}
                >
                  <AddIcon sx={{ color: '#64748b', fontSize: 20 }} />
                </Box>
              </Box>

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
