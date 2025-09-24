export const statusCards = [
  { title: 'Draft', value: '29', color: '#ec4899', bgColor: '#fce7f3', icon: 'InfoIcon' },
  { title: 'Action Required', value: '49', color: '#ef4444', bgColor: '#fee2e2', icon: 'WarningIcon' },
  { title: 'Pre Arrivals', value: '307', color: '#3b82f6', bgColor: '#dbeafe', icon: 'ShippingIcon' },
];

export const statusOptions = [
  'Action Required',
  'In Review',
  'Ready to Send'
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Action Required':
      return { color: '#ef4444', bgColor: '#fee2e2' };
    case 'In Review':
      return { color: '#3b82f6', bgColor: '#dbeafe' };
    case 'Ready To Send':
      return { color: '#22c55e', bgColor: '#dcfce7' };
    case 'Ready To Ship':
      return { color: '#22c55e', bgColor: '#dcfce7' };
    case 'Request Ship':
      return { color: '#ff9800', bgColor: '#fff3e0' };
    case 'Departed':
      return { color: '#9c27b0', bgColor: '#f3e5f5' };
    case 'Discarded':
      return { color: '#d32f2f', bgColor: '#ffebee' };
    default:
      return { color: '#64748b', bgColor: '#f1f5f9' };
  }
};
