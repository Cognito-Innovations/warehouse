export const shipmentExports = [
  { id: 'MS/IN/2025010', date: 'Aug 28, 2025, 10:27:47 PM', mawb: null, count: 1, createdBy: 'Ushaya', status: 'DRAFT' },
  { id: 'MS/IN/2025009', date: 'Aug 19, 2025, 5:30:15 PM', mawb: null, count: 7, createdBy: 'Ushaya', status: 'DRAFT' },
  { id: 'MS/IN/2025008', date: 'Jul 28, 2025, 7:26:01 PM', mawb: null, count: 6, createdBy: 'Ushaya', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2025007', date: 'Jul 11, 2025, 2:23:34 PM', mawb: '603-76168055', count: 4, createdBy: 'Ushaya', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2025006', date: 'Jun 19, 2025, 6:14:58 PM', mawb: '603-76140550', count: 4, createdBy: 'Ushaya', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2025005', date: 'Jun 6, 2025, 12:24:23 PM', mawb: '603-76135662', count: 1, createdBy: 'Ushaya', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2025004', date: 'May 29, 2025, 1:23:36 PM', mawb: '603-76135662', count: 2, createdBy: 'Ushaya', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2025003', date: 'May 15, 2025, 11:17:37 AM', mawb: '603-76128496', count: 2, createdBy: 'Ushaya', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2025002', date: 'Apr 15, 2025, 12:17:07 PM', mawb: null, count: 1, createdBy: 'Naeema Riza', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2025001', date: 'Jan 4, 2025, 4:22:09 PM', mawb: null, count: 1, createdBy: 'Shabeer', status: 'DRAFT' },
  { id: 'MS/IN/2024033', date: 'Dec 21, 2024, 5:04:19 PM', mawb: null, count: 1, createdBy: 'Shabeer', status: 'DRAFT' },
  { id: 'MS/IN/2024032', date: 'Dec 4, 2024, 5:28:06 PM', mawb: null, count: 2, createdBy: 'Shabeer', status: 'SHIPMENTS DEPARTED' },
  { id: 'MS/IN/2024031', date: 'Nov 14, 2024, 3:16:19 PM', mawb: null, count: 1, createdBy: 'Shabeer', status: 'EXPORT GENERATED' },
  { id: 'MS/IN/2024030', date: 'Nov 9, 2024, 5:01:18 PM', mawb: null, count: 1, createdBy: 'Shabeer', status: 'DRAFT' },
  { id: 'MS/IN/2024029', date: 'Nov 4, 2024, 6:18:43 PM', mawb: null, count: 1, createdBy: 'Shabeer', status: 'DRAFT' },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return { color: '#f59e0b', bgColor: '#fef3c7' };
    case 'SHIPMENTS DEPARTED':
      return { color: '#64748b', bgColor: '#f1f5f9' };
    case 'EXPORT GENERATED':
        return { color: '#64748b', bgColor: '#f1f5f9' };
    default:
      return { color: '#64748b', bgColor: '#f1f5f9' };
  }
};