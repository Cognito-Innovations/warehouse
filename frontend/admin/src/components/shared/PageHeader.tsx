import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, buttonText, onButtonClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1e293b' }}>
        {title}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onButtonClick}
        sx={{
            bgcolor: '#6366f1',
            '&:hover': { bgcolor: '#4f46e5' },
            textTransform: 'none',
            fontWeight: 600,
            py: 1.25,
            px: 2.5
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default PageHeader;