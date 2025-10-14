import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, IconButton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, CloudUpload as UploadIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { toast } from 'sonner';
import { deletePackageDocument, updatePackageStatus, uploadPackageDocuments } from '../../services/api.services';
import UploadModal from './UploadModal';
import ImageWithPreview from './ImageWithPreview';
import { formatFileName } from '../../utils/formatFileName';

interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  localURL?: string;
  type: string;
  status?: 'uploading' | 'completed' | 'failed';
}

interface PackageItem {
  id: string;
  name: string;
  quantity: number;
}

interface ActionLogsSectionProps {
  packageId: string;
  initialStatus: { label: string; value: string };
  initialDocuments: UploadedDocument[];
  packageItems: PackageItem[];
  packageCreationData: {
    createdBy: string;
    createdAt: string;
  };
  onActionLogUpdate: () => void;
  isDiscarded: boolean;
}

const ActionLogsSection: React.FC<ActionLogsSectionProps> = ({
  packageId,
  initialStatus,
  initialDocuments,
  packageItems,
  packageCreationData,
  onActionLogUpdate,
  isDiscarded,
}) => {
  const [actionLogStatus, setActionLogStatus] = useState(initialStatus.value);
  const [isAdminChecked, setIsAdminChecked] = useState(initialStatus.value === 'Ready To Send');
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(initialDocuments);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActionLogStatus(initialStatus.value);
    setIsAdminChecked(initialStatus.value === 'Ready To Send');
    const formattedInitialDocs = initialDocuments.map(doc => ({ ...doc, status: 'completed' as const }));
    setUploadedDocuments(formattedInitialDocs);
  }, [initialStatus, initialDocuments]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updatePackageStatus(packageId, newStatus);
      setActionLogStatus(newStatus);
      onActionLogUpdate();
    } catch (err) {
      console.error('Failed to update package status:', err);
      toast.error('Failed to update package status');
    }
  };

  const handleAdminCheck = (checked: boolean) => {
    setIsAdminChecked(checked);
  };

  const handleOpenUploadModal = () => setUploadModalOpen(true);
  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedFiles([]);
  };

  const handleFileSelectForModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleRemoveFileFromModal = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const performUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const tempDocuments: UploadedDocument[] = files.map(file => ({
      id: `local-${Date.now()}-${file.name}`,
      name: file.name,
      url: '',
      localURL: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      type: file.type,
      status: 'uploading',
    }));

    setUploadedDocuments(prev => [...prev, ...tempDocuments]);

    try {
      const responseData = await uploadPackageDocuments(packageId, files);
      const newDocuments = responseData.documents || [];

      const completedDocuments = newDocuments.map((newDoc: any, index: number) => ({
        id: newDoc.id,
        name: newDoc.document_name,
        url: newDoc.document_url,
        localURL: tempDocuments[index]?.localURL,
        type: files[index]?.type,
        status: 'completed' as const,
      }));

      setUploadedDocuments(prev => {
        const otherDocuments = prev.filter(doc => !tempDocuments.some(temp => temp.id === doc.id));
        return [...otherDocuments, ...completedDocuments];
      });

      if (actionLogStatus === 'Action Required') {
        await handleStatusChange('In Review');
        setIsAdminChecked(false);
      }
      toast.success('Documents uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload documents:', err);
      toast.error('Failed to upload documents');

      setUploadedDocuments(prev => 
        prev.map(doc => 
          tempDocuments.some(temp => temp.id === doc.id) ? { ...doc, status: 'failed' } : doc
        )
      );
    }
  };

  const handleUploadFromModal = async () => {
    await performUpload(selectedFiles);
    handleCloseUploadModal();
  };

  const handleDirectFileSelect = async (files: FileList) => {
    if (files.length > 0) {
      await performUpload(Array.from(files));
    }
  };

  const handleRemoveDocument = async (documentId: string) => {
    const docToRemove = uploadedDocuments.find(d => d.id === documentId);
    if (docToRemove?.status === 'uploading') {
      toast.error("Please wait for the upload to complete before deleting.");
      return;
    }
    
    setDeletingDocId(documentId);
    try {
      await deletePackageDocument(packageId, documentId);
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document removed.');
    } catch (err) {
      console.error('Failed to delete document:', err);
      toast.error('Failed to delete document');
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleDirectFileSelect(e.dataTransfer.files);
  };
  const handleClick = () => fileInputRef.current?.click();

  const allowedStatuses = [
    'Ready To Send',
    'Request Ship',
    'Payment Pending',
    'Payment Approved',
    'Ready To Ship',
    'Departed',
  ];
  const visualChecked = isAdminChecked || allowedStatuses.includes(actionLogStatus);
  const isCurrentlyUploading = uploadedDocuments.some(doc => doc.status === 'uploading');
  
  return (
    <>
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
              onClick={handleOpenUploadModal}
              disabled={isDiscarded}
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
                  border: visualChecked ? '2px solid #22c55e' : '2px solid #ef4444',
                  bgcolor: visualChecked ? '#22c55e' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 0.5,
                  cursor: isDiscarded ? 'not-allowed' : uploadedDocuments.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: isDiscarded ? 0.4 : uploadedDocuments.length > 0 ? 1 : 0.5,
                  '&:hover': {
                    bgcolor: uploadedDocuments.length > 0
                      ? (visualChecked ? '#16a34a' : '#fef2f2')
                      : 'transparent'
                  }
                }}
                onClick={() => {
                  if (isDiscarded) return;

                  if (actionLogStatus === 'In Review' && packageItems.length === 0) {
                    toast.error('Please add package items before verifying.');
                    return;
                  }

                  // Only allow clicking if documents are uploaded
                  if (uploadedDocuments.length === 0) return;

                  // Toggle visual check state
                  const newCheckedState = !visualChecked;
                  handleAdminCheck(newCheckedState);

                  // Update status based on admin check
                  if (newCheckedState) {
                    handleStatusChange('Ready To Send');
                  } else {
                    handleStatusChange('In Review');
                  }
                }}
              >
                {visualChecked ? (
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
                    actionLogStatus === 'Ready To Send' ? 'Ready To Send' : 'Documents'}
                </Typography>

                <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.875rem' }}>
                  {actionLogStatus === 'Action Required' ? 'Please upload item invoice' :
                    actionLogStatus === 'In Review' ? 'Documents are being reviewed' :
                    actionLogStatus === 'Ready To Send' ? 'Package is ready to be sent' : 'Upload item invoice'}
                </Typography>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => handleDirectFileSelect(e.target.files!)}
                />

                {/* Show upload area only when no documents exist */}
                {uploadedDocuments.length === 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box
                      onClick={isCurrentlyUploading || isDiscarded ? undefined : handleClick}
                      onDragOver={isCurrentlyUploading || isDiscarded ? undefined : handleDragOver}
                      onDragLeave={isCurrentlyUploading || isDiscarded ? undefined : handleDragLeave}
                      onDrop={isCurrentlyUploading || isDiscarded ? undefined : handleDrop}
                      sx={{
                        position: 'relative',
                        border: `2px dashed ${isDragOver ? '#3b82f6' : '#d1d5db'}`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: isCurrentlyUploading || isDiscarded ? 'not-allowed' : 'pointer',
                        bgcolor: isDragOver ? '#f0f9ff' : '#fafafa',
                        transition: 'all 0.2s ease-in-out',
                        opacity: isCurrentlyUploading || isDiscarded ? 0.5 : 1,
                        '&:hover': {
                          borderColor: isCurrentlyUploading ? '#d1d5db' : '#3b82f6',
                          bgcolor: isCurrentlyUploading ? '#fafafa' : '#f0f9ff'
                        }
                      }}
                    > 
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
                    </Box>
                  </Box>
                )}

                {/* Show document thumbnails when documents exist */}
                {uploadedDocuments.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {uploadedDocuments.map((doc) => {
                        const isPdf = doc.name.toLowerCase().endsWith('.pdf');
                        return (
                          <Box key={doc.id} sx={{ position: 'relative', textAlign: 'center', width: 80 }}>
                            {isPdf ? (
                              <Box
                                onClick={() => doc.url && window.open(doc.url, '_blank')}
                                sx={{
                                  width: 80,
                                  height: 60,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: '#f8f9fa',
                                  borderRadius: 1,
                                  border: '1px solid #e9ecef',
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: '#e9ecef' }
                                }}
                              >
                                <PictureAsPdfIcon sx={{ fontSize: 36, color: '#64748b' }} />
                              </Box>
                            ) : (
                              <ImageWithPreview
                                previewSrc={doc.localURL}
                                finalSrc={doc.url}
                                alt={doc.name}
                                onClick={() => doc.url && window.open(doc.url, '_blank')}
                                sx={{
                                  width: 80,
                                  height: 60,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: '1px solid #e9ecef',
                                  cursor: 'pointer',
                                }}
                              />
                            )}

                            {doc.status === 'uploading' && (
                              <Box sx={{
                                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', bgcolor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: 1, height: 60,
                              }}>
                                <CircularProgress size={24} />
                              </Box>
                            )}                            
                            {deletingDocId === doc.id && (
                              <Box sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: 1,
                                height: 60,
                              }}>
                                <CircularProgress size={24} />
                              </Box>
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '0.7rem',
                                color: '#64748b',
                                mt: 0.5,
                              }}
                            >
                              {formatFileName(doc.name)}
                            </Typography>
                            {doc.status !== 'uploading' && (
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveDocument(doc.id)}
                                disabled={!!deletingDocId || isDiscarded}
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
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                    
                    {/* Add more button when documents exist */}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={isCurrentlyUploading ? <CircularProgress size={16} /> : <AddIcon />}
                      onClick={isCurrentlyUploading || isDiscarded ? undefined : handleClick}
                      disabled={isCurrentlyUploading || isDiscarded}
                      sx={{ mt: 1, fontSize: '0.75rem' }}
                    >
                      {isCurrentlyUploading ? 'Uploading...' : 'Add More Documents'}
                    </Button>
                  </Box>
                )}

                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                  {packageCreationData.createdBy} {packageCreationData.createdAt}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <UploadModal
        open={uploadModalOpen}
        selectedFiles={selectedFiles}
        onClose={handleCloseUploadModal}
        onFileSelect={handleFileSelectForModal}
        onUpload={handleUploadFromModal}
        onRemoveFile={handleRemoveFileFromModal}
        isUploading={isCurrentlyUploading }
      />
    </>
  );
};

export default ActionLogsSection;
