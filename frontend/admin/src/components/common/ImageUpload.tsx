import React, { useState, useRef } from 'react';
import { Box, Button, CircularProgress, Snackbar, Alert, Typography, FormControl, FormLabel, FormHelperText } from '@mui/material';

import { uploadToCloudinary } from '../../utils/cloudinary.api';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = 'Upload Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG and PNG files are allowed.');
      setOpen(true);
      event.target.value = '';
      return;
    }

    setUploading(true);
    const url = await uploadToCloudinary(file);
    if (url) {
      onChange(url);
    } else {
      setError('Failed to upload image. Please try again.');
      setOpen(true);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => setOpen(false);

  return (
    <FormControl fullWidth variant="standard" sx={{ mb: 2.5 }}>
      <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p: 1.5,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: (theme) => theme.shape.borderRadius,
          bgcolor: 'background.paper',
          minHeight: 56,
          justifyContent: 'center',
        }}
      >
        {value ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box
              component="img"
              src={value}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: 150,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 1,
              }}
            />
            <Button
              variant="text"
              size="small"
              onClick={handleUploadClick}
              disabled={uploading}
              sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
            >
              {uploading ? 'Uploading...' : 'Replace Image'}
              {uploading && <CircularProgress size={16} sx={{ ml: 1 }} />}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              No image selected
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleUploadClick}
              disabled={uploading}
              sx={{ textTransform: 'none' }}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
              {uploading && <CircularProgress size={16} sx={{ ml: 1 }} />}
            </Button>
          </Box>
        )}
      </Box>
      <FormHelperText>Supported formats: JPG, PNG</FormHelperText>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </FormControl>
  );
};

export default ImageUpload;