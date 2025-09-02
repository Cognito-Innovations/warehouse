import React, { useState } from 'react';
import { Box, IconButton, Typography, Fade } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        size="small"
        sx={{ bgcolor: '#e0e7ff', color: '#1481E2', '&:hover': { bgcolor: '#c7d2fe' } }}
        onClick={handleCopy}
      >
        <ContentCopyIcon fontSize="inherit" />
      </IconButton>

      <Fade in={copied}>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: '-26px',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            px: 0.6,
            py: 0.2,
            fontSize: '0.7rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          Copied!
        </Typography>
      </Fade>
    </Box>
  );
};

export default CopyButton;