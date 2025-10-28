import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Box, Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon, CloudUpload as UploadIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { uploadToCloudinary } from "../../../utils/cloudinary.api";
import { formatFileName } from "../../../utils/formatFileName";
import { createShipmentDocument } from "../../../services/api.services";
import { formatDateTime } from "../../../utils/formatDateTime";

interface Document {
  id: string;
  document_url: string;
  original_filename: string;
  mime_type: string;
}

interface Shipments {
  id?: string;
  created_by?: {
    name: string;
  }
  created_at?: string;
  [key: string]: unknown;
}

interface ShipmentsPhotosSectionProps {
  shipments: Shipments;
  documents: Document[];
  onUploadSuccess?: () => Promise<void>;
}

const ShipmentsPhotosSection: React.FC<ShipmentsPhotosSectionProps> = ({
    shipments,
    documents,
    onUploadSuccess,
}) => {
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const isUploadDisabled = !shipments.id;
    
    const handleFileSelect = async (files: FileList | null) => {
      if (isUploadDisabled) {
        toast.error("You can't upload files until the package is created.");
        return;
      }

      if (!files || files.length === 0) return;
      setUploading(true);
      const filesArray = Array.from(files);

      try {
        for (const file of filesArray) {
          const url = await uploadToCloudinary(file);
          if (url) {
            await createShipmentDocument(shipments.id!, {
              url,
              original_filename: file.name,
              mime_type: file.type,
              file_size: file.size,
              category: 'SHIPMENT_PHOTO',
            })
          }
        }
        await onUploadSuccess?.();
        toast.success('Files uploaded successfully');
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Failed to upload files.');
      } finally {
        setUploading(false);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!uploading) setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (uploading) return;
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    };

    const handleFileClick = () => {
      if (!uploading) fileInputRef.current?.click();
    };

    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Shipment Photos
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleFileClick}
                  sx={{
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' },
                    textTransform: 'none',
                    borderRadius: 1,
                  }}
                  disabled={uploading || isUploadDisabled}
                >
                  Upload
                </Button>
            </Box>

            <Card sx={{ mb: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              <CardContent>

                <Box sx={{
                  bgcolor: '#ffffff',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      Uploaded Files
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.875rem' }}>
                      View or upload photos and documents.
                    </Typography>
            
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />

                    {documents.length === 0 ? (
                      <Box sx={{ mb: 2 }}>
                        <Box
                          onClick={handleFileClick}
                          onDragOver={uploading ? undefined : handleDragOver}
                          onDragLeave={uploading ? undefined : handleDragLeave}
                          onDrop={uploading ? undefined : handleDrop}
                          sx={{
                            border: `2px dashed ${isDragOver ? '#3b82f6' : '#d1d5db'}`,
                            borderRadius: 2, p: 3, textAlign: 'center',
                            cursor: uploading || isUploadDisabled ? 'not-allowed' : 'pointer',
                            bgcolor: isDragOver ? '#f0f9ff' : '#fafafa',
                            transition: 'all 0.2s ease-in-out',
                            opacity: uploading ? 0.6 : 1,
                            '&:hover': {
                              borderColor: uploading ? '#d1d5db' : '#3b82f6',
                              bgcolor: uploading ? '#fafafa' : '#f0f9ff'
                            }
                          }}
                        >
                          {uploading ? (
                            <>
                              <CircularProgress size={48} sx={{ color: '#3b82f6', mb: 1 }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                                Uploading files...
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                Please wait while your files are being uploaded
                              </Typography>
                            </>
                          ) : (
                            <>
                              <UploadIcon sx={{ fontSize: 48, color: isDragOver ? '#3b82f6' : '#9ca3af', mb: 1 }} />
                              <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                                {isUploadDisabled ? 'Awaiting shipment creation' : (isDragOver ? 'Drop files here' : 'Click to upload or drag and drop')}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                PNG, JPG, PDF up to 10MB
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {documents.map((doc) => {
                            if (!doc || !doc.document_url) {
                              return null;
                            }
                            const isPdf = doc.original_filename.toLowerCase().endsWith('.pdf');
                            return (
                              <Box key={doc.id} sx={{ position: 'relative', textAlign: 'center', width: 80 }}>
                                {isPdf ? (
                                  <Box
                                    onClick={() => window.open(doc.document_url, '_blank')}
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
                                    alt={doc.original_filename}
                                    src={doc.document_url}
                                    onClick={() => window.open(doc.document_url, '_blank')}
                                  />
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
                                  {formatFileName(doc.original_filename)}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={uploading ? <CircularProgress size={16} /> : <AddIcon />}
                          onClick={handleFileClick}
                          disabled={uploading || isUploadDisabled}
                          sx={{ mt: 1, fontSize: '0.75rem' }}
                        >
                          {uploading ? 'Uploading...' : 'Add More Documents'}
                        </Button>
                      </Box>
                    )}

                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {shipments.created_by?.name} {formatDateTime(shipments.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
        </Box>
    )
}

export default ShipmentsPhotosSection;