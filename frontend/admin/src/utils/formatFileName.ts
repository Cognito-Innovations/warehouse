export const formatFileName = (name: string): string => {
  // Find the last dot to separate the base name from the extension
  const lastDotIndex = name.lastIndexOf(".");

  // If there's no extension, just truncate the whole name
  if (lastDotIndex === -1) {
    return name.length > 10 ? `${name.substring(0, 10)}...` : name;
  }

  const baseName = name.substring(0, lastDotIndex);
  const extension = name.substring(lastDotIndex);

  if (baseName.length > 10) {
    return `${baseName.substring(0, 10)}...${extension}`;
  }
  
  return name;
};