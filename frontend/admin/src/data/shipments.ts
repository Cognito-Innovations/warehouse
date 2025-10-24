import { RequestQuoteOutlined, Inventory2Outlined, FlightTakeoffOutlined } from '@mui/icons-material';

export const statusMap: Record<string, string> = {
  'SHIP_REQUEST': 'Ship Request',
  'READY_TO_SHIP': 'Ready to Ship',
  'PAYMENT_APPROVED': 'Payment Approved',
};

export const statusCards = [
  { title: 'Ship Request', statusValue: 'SHIP_REQUEST', value: 0, color: '#f59e0b', bgColor: '#fef3c7', icon: RequestQuoteOutlined },
  { title: 'Ready to Ship', statusValue: 'READY_TO_SHIP', value: 0, color: '#ec4899', bgColor: '#fce7f3', icon: Inventory2Outlined },
  { title: 'Shipped', statusValue: 'PAYMENT_APPROVED', value: 0, color: '#6366f1', bgColor: '#e0e7ff', icon: FlightTakeoffOutlined },
];

export const getStatusAndInvoiceColor = (status: string) => {
    switch (status) {
        case 'SHIP_REQUEST':
            return { color: '#f59e0b', bgColor: '#fef3c7' };
        case 'PENDING':
            return { color: '#f59e0b', bgColor: '#fef3c7' };
        case 'PAYMENT_PENDING':
            return { color: '#ef4444', bgColor: '#fee2e2' };
        case 'UNPAID':
            return { color: '#ef4444', bgColor: '#fee2e2' };
        case 'PAYMENT_APPROVED':
            return { color: '#22c55e', bgColor: '#dcfce7' };
        case 'PAID':
            return { color: '#22c55e', bgColor: '#dcfce7' };
        case 'READY_TO_SHIP':
            return { color: '#3b82f6', bgColor: '#dbeafe' };
        default:
            return { color: '#64748b', bgColor: '#f1f5f9' };
    }
};

export const statusOptions = ['ALL', 'SHIP_REQUEST', 'Pending', 'PAYMENT_APPROVED', 'READY_TO_SHIP'];