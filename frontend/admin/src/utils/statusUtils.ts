export const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    // Common
    case 'REQUESTED':
      return { color: '#F59E0B', bgColor: '#FEF3C7' }; // Amber
    case 'CANCELLED':
      return { color: '#DC2626', bgColor: '#FEE2E2' }; // Red

    // Shopping
    case 'PAID':
      return { color: '#059669', bgColor: '#D1FAE5' }; // Green
    case 'ORDER PLACED':
      return { color: '#4F46E5', bgColor: '#E0E7FF' }; // Indigo

    // Pickup
    case 'QUOTATION CONFIRMED':
      return { color: '#059669', bgColor: '#D1FAE5' }; // Green
    case 'ACCEPTED':
    case 'PICKED':
      return { color: '#2563EB', bgColor: '#DBEAFE' }; // Blue

    default:
      return { color: '#6B7280', bgColor: '#F3F4F6' }; // Gray
  }
};