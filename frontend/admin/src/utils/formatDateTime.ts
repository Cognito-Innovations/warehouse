export const formatDateTime = (timestamp?: string | number) => {
  if (!timestamp) return '';
  const ts = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
  const date = new Date(ts * 1000);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
};
