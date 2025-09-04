export const getChipStyles = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return { backgroundColor: '#FEF9C3', color: '#B45309' }; // Yellow
    case 'QUOTED':
    case 'PICKED':
    case 'CONFIRMED':
      return { backgroundColor: '#DCFCE7', color: '#15803D' }; // Green
    case 'CANCELLED':
      return { backgroundColor: '#FEE2E2', color: '#B91C1C' }; // Red
    default:
      return { backgroundColor: '#E0E0E0', color: '#424242' }; // Fallback grey
  }
};