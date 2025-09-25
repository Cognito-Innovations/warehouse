export const formatDateTime = (timestamp?: string | number) => {
  if (!timestamp) return '';
  const tsInSeconds = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  const date = new Date(tsInSeconds * 1000);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};
