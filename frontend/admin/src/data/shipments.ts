import { RequestQuoteOutlined, Inventory2Outlined, FlightTakeoffOutlined } from '@mui/icons-material';

export const statusCards = [
  { title: 'Ship Request', statusValue: 'SHIP REQUESTED', value: 13, color: '#f59e0b', bgColor: '#fef3c7', icon: RequestQuoteOutlined },
  { title: 'Ready to Ship', statusValue: 'READY TO SHIP', value: 215, color: '#ec4899', bgColor: '#fce7f3', icon: Inventory2Outlined },
  { title: 'Shipped', statusValue: 'PAYMENT APPROVED', value: 592, color: '#6366f1', bgColor: '#e0e7ff', icon: FlightTakeoffOutlined },
];

export const shipments = [
    {
        id: 'S2025182N',
        trackingNo: 'RB3561825451',
        courier: 'REDBOX',
        customer: {
            name: 'Ibrahim Waheed',
            suiteNo: '917-454',
        },
        requestAt: 'Aug 31, 2025',
        requestTime: '10:37 AM',
        status: 'SHIP REQUESTED',
        pkgsCount: 6,
        invoice: 'PENDING',
        items: [],
    },
    {
        id: 'S2025181N',
        trackingNo: 'RB3561823233',
        courier: 'REDBOX',
        customer: {
            name: 'Aishath Arshee Khaleel',
            suiteNo: '869-610',
        },
        requestAt: 'Aug 31, 2025',
        requestTime: '09:15 AM',
        status: 'SHIP REQUESTED',
        pkgsCount: 4,
        invoice: 'PENDING',
        items: [],
    },
    {
        id: 'S2025180N',
        trackingNo: 'RB3561823811',
        courier: 'REDBOX',
        customer: {
            name: 'Aminath Shaufa',
            suiteNo: '220-241',
        },
        requestAt: 'Aug 31, 2025',
        requestTime: '09:33 AM',
        status: 'SHIP REQUESTED',
        pkgsCount: 1,
        invoice: 'PENDING',
        items: [
            {
                id: 1,
                packageNo: 'IN2025375',
                rack: 'PACKAGE ARRIVED',
                trackingNo: '166209972853',
                courier: 'DELHIVERY',
                receivedAt: 'Jul 14, 2025',
                receivedTime: '06:55 PM',
                weight: '0.4 KG',
                volWeight: '',
                items: [
                    { name: '1', quantity: 2, amount: '$15.00', total: '$30.00' },
                ]
            }
        ],
    },
    {
        id: 'S2025179N',
        trackingNo: 'RB356171138',
        courier: 'REDBOX',
        customer: {
            name: 'Sawlima Abdhooha',
            suiteNo: '516-618',
        },
        requestAt: 'Aug 27, 2025',
        requestTime: '01:17 PM',
        status: 'PAYMENT APPROVED',
        pkgsCount: 3,
        invoice: 'PAID',
        items: [],
    },
];

export const getStatusAndInvoiceColor = (status: string) => {
    switch (status) {
        case 'SHIP REQUESTED':
            return { color: '#f59e0b', bgColor: '#fef3c7' };
        case 'PENDING':
            return { color: '#f59e0b', bgColor: '#fef3c7' };
        case 'PAYMENT PENDING':
            return { color: '#ef4444', bgColor: '#fee2e2' };
        case 'UNPAID':
            return { color: '#ef4444', bgColor: '#fee2e2' };
        case 'PAYMENT APPROVED':
            return { color: '#22c55e', bgColor: '#dcfce7' };
        case 'PAID':
            return { color: '#22c55e', bgColor: '#dcfce7' };
        case 'READY TO SHIP':
            return { color: '#3b82f6', bgColor: '#dbeafe' };
        default:
            return { color: '#64748b', bgColor: '#f1f5f9' };
    }
};

export const statusOptions = ['ALL', 'SHIP REQUESTED', 'PENDING', 'READY TO SHIP'];