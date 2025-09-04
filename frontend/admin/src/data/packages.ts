export const statusCards = [
  { title: 'Draft', value: '29', color: '#ec4899', bgColor: '#fce7f3', icon: 'InfoIcon' },
  { title: 'Action Required', value: '49', color: '#ef4444', bgColor: '#fee2e2', icon: 'WarningIcon' },
  { title: 'Pre Arrivals', value: '307', color: '#3b82f6', bgColor: '#dbeafe', icon: 'ShippingIcon' },
];

export const packages = [
  {
    id: 1,
    packageNo: 'IN2025618',
    status: 'PACKAGE ARRIVED',
    trackingNo: '362934524329',
    carrier: 'AMAZON INDIA',
    customer: 'Unidentified',
    customerCode: '999-999',
    receivedAt: 'Aug 30, 2025',
    time: '06:11 PM',
    statusType: 'ACTION REQUIRED'
  },
  {
    id: 2,
    packageNo: 'IN2025617',
    status: 'PACKAGE ARRIVED',
    trackingNo: '363024052630',
    carrier: 'AMAZON INDIA',
    customer: 'Hawwa Nuzhath',
    customerCode: '794-905',
    receivedAt: 'Aug 30, 2025',
    time: '06:10 PM',
    statusType: 'ACTION REQUIRED'
  },
  {
    id: 3,
    packageNo: 'IN2025616',
    status: 'PACKAGE ARRIVED',
    trackingNo: '363090650884',
    carrier: 'AMAZON INDIA',
    customer: 'Unidentified',
    customerCode: '999-999',
    receivedAt: 'Aug 30, 2025',
    time: '06:09 PM',
    statusType: 'ACTION REQUIRED'
  },
  {
    id: 4,
    packageNo: 'IN2025614',
    status: 'PACKAGE ARRIVED',
    trackingNo: '64165646134',
    carrier: '',
    customer: 'Ibrahim Sifan',
    customerCode: '603-450',
    receivedAt: 'Aug 30, 2025',
    time: '12:59 PM',
    statusType: 'ACTION REQUIRED'
  },
  {
    id: 5,
    packageNo: 'IN2025610',
    status: 'PACKAGE ARRIVED',
    trackingNo: '363002022785',
    carrier: 'AMAZON INDIA',
    customer: 'Hawwa Nuzhath',
    customerCode: '794-905',
    receivedAt: 'Aug 29, 2025',
    time: '04:38 PM',
    statusType: 'ACTION REQUIRED'
  },
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
    case 'ACTION REQUIRED':
      return { color: '#ef4444', bgColor: '#fee2e2' };
    case 'In Review':
      return { color: '#3b82f6', bgColor: '#dbeafe' };
    case 'IN REVIEW':
      return { color: '#3b82f6', bgColor: '#dbeafe' };
    case 'Ready to Send':
      return { color: '#22c55e', bgColor: '#dcfce7' };
    case 'READY TO SEND':
      return { color: '#22c55e', bgColor: '#dcfce7' };
    case 'Ship Requested':
      return { color: '#22c55e', bgColor: '#dcfce7' };
    case 'SHIP REQUESTED':
      return { color: '#22c55e', bgColor: '#dcfce7' };
    default:
      return { color: '#64748b', bgColor: '#f1f5f9' };
  }
};
