import React, { useState, useEffect } from 'react';
import { Box, type SxProps } from '@mui/material';

interface ImageWithPreviewProps {
  previewSrc?: string;
  finalSrc: string;
  alt: string;
  sx?: SxProps;
  onClick?: () => void;
}

const ImageWithPreview: React.FC<ImageWithPreviewProps> = ({
  previewSrc,
  finalSrc,
  alt,
  sx,
  onClick,
}) => {
  const [currentSrc, setCurrentSrc] = useState(previewSrc || finalSrc);

  useEffect(() => {
    if (finalSrc) {
      const imageLoader = new Image();
      imageLoader.src = finalSrc;

      imageLoader.onload = () => {
        setCurrentSrc(finalSrc);
      };
    }
  }, [finalSrc]);

  return (
    <Box
      component="img"
      sx={sx}
      alt={alt}
      src={currentSrc}
      onClick={onClick}
    />
  );
};

export default ImageWithPreview;