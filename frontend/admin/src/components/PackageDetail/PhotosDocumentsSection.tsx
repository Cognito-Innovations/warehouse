import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { toast } from 'sonner';

const PhotosDocumentsSection: React.FC = () => {
  const handleUploadClick = () => {
    toast.info('Feature coming soon');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Photos / Documents
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            size="small"
            onClick={handleUploadClick}
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              textTransform: 'none'
            }}
          >
            Upload
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          No photo / document found
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PhotosDocumentsSection;
