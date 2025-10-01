export const formatDateTime = (timestamp?: string | number) => {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};