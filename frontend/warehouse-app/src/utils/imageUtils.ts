export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ImageOptimalSizing {
  objectFit: "cover" | "contain" | "fill" | "none" | "scale-down";
  width: string;
  height: string;
  maxHeight?: string;
  objectPosition?: string;
}

// Handles image load and extracts dimensions
export const handleImageLoad = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  setDimensions: (dimensions: ImageDimensions) => void
): void => {
  const img = e.target as HTMLImageElement;
  const { naturalWidth, naturalHeight } = img;
  const aspectRatio = naturalWidth / naturalHeight;
  
  setDimensions({
    width: naturalWidth,
    height: naturalHeight,
    aspectRatio,
  });
};

// Calculates optimal image sizing based on aspect ratio
export const getOptimalImageSizing = (
  imageDimensions: ImageDimensions | null,
  containerAspectRatio: number = 1
): ImageOptimalSizing => {
  if (!imageDimensions) {
    return {
      objectFit: "cover",
      width: "100%",
      height: "100%",
    };
  }

  const { aspectRatio } = imageDimensions;
  
  // If image is portrait (taller than wide), use contain with dynamic height
  if (aspectRatio < 0.8) {
    return {
      objectFit: "contain",
      width: "100%",
      height: "auto",
      maxHeight: "100%",
    };
  } 
  // If image is landscape (wider than tall), use cover with center positioning
  else if (aspectRatio > 1.2) {
    return {
      objectFit: "cover",
      width: "100%",
      height: "100%",
      objectPosition: "center",
    };
  }
  // If image is roughly square, use cover
  else {
    return {
      objectFit: "cover",
      width: "100%",
      height: "100%",
    };
  }
};

// Simple image sizing for consistent product thumbnails
export const getProductImageSizing = (): ImageOptimalSizing => {
  return {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    objectPosition: "center",
  };
};

// For images that should always show completely without cropping
export const getContainedImageSizing = (): ImageOptimalSizing => {
  return {
    objectFit: "contain",
    width: "100%",
    height: "100%",
    objectPosition: "center",
  };
};

// For images that should scale down if larger than container
export const getScaleDownImageSizing = (): ImageOptimalSizing => {
  return {
    objectFit: "scale-down",
    width: "100%",
    height: "100%",
    objectPosition: "center",
  };
};