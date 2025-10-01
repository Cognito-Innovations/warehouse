/**
 * Generate a unique suite number in format (XXXX-XXXX)
 * @returns Suite number string
 */
export const generateSuiteNumber = (): string => {
  // Generate a random 4-digit number between 1000-9999
  const firstPart = Math.floor(Math.random() * 9000) + 1000;
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  return `${firstPart}-${secondPart}`;
};

/**
 * Generate a unique suite number with a specific pattern
 * Starting from 1001-1001 and incrementing
 * @returns Suite number string
 */
export const generateSequentialSuiteNumber = (): string => {
  // Get current timestamp and use it to generate a sequential-like number
  const timestamp = Date.now();
  const baseNumber = 1001 + (timestamp % 8000); // Ensure it stays in 1001-9001 range
  return `${baseNumber}-${baseNumber}`;
};
