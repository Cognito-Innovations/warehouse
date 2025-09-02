export const shoppingRequests = [
    { orderNo: 'SR/IN/2025177', requestedAt: { date: 'Aug 30, 2025', time: '06:47 PM' }, customer: { name: 'Ismail Asif', id: '248-549' }, status: 'REQUESTED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025175', requestedAt: { date: 'Aug 28, 2025', time: '06:10 PM' }, customer: { name: 'Javid Ismail', id: '896-451' }, status: 'REQUESTED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025172', requestedAt: { date: 'Aug 26, 2025', time: '01:15 PM' }, customer: { name: 'AFSAL HUSSAIN', id: '719-452' }, status: 'PAID', noOfItems: 3 },
    { orderNo: 'SR/IN/2025169', requestedAt: { date: 'Aug 22, 2025', time: '03:22 PM' }, customer: { name: 'Ajmalh ismail', id: '122-485' }, status: 'CANCELLED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025171', requestedAt: { date: 'Aug 24, 2025', time: '07:10 AM' }, customer: { name: 'Mihna', id: '353-372' }, status: 'ORDER PLACED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025167', requestedAt: { date: 'Aug 22, 2025', time: '12:08 PM' }, customer: { name: 'Shafee Naeem', id: '594-848' }, status: 'CANCELLED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025168', requestedAt: { date: 'Aug 22, 2025', time: '12:59 PM' }, customer: { name: 'Mihna', id: '353-372' }, status: 'ORDER PLACED', noOfItems: 6 },
    { orderNo: 'SR/IN/2025166', requestedAt: { date: 'Aug 20, 2025', time: '12:30 PM' }, customer: { name: 'Abdulla Waheed', id: '413-440' }, status: 'ORDER PLACED', noOfItems: 2 },
    { orderNo: 'SR/IN/2025165', requestedAt: { date: 'Aug 18, 2025', time: '08:56 PM' }, customer: { name: 'Mihna', id: '353-372' }, status: 'ORDER PLACED', noOfItems: 5 },
    { orderNo: 'SR/IN/2025162', requestedAt: { date: 'Aug 15, 2025', time: '07:27 PM' }, customer: { name: 'Mohamed Nabeel', id: '144-276' }, status: 'CANCELLED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025161', requestedAt: { date: 'Aug 15, 2025', time: '04:53 PM' }, customer: { name: 'Samha', id: '722-320' }, status: 'CANCELLED', noOfItems: 2 },
    { orderNo: 'SR/IN/2025160', requestedAt: { date: 'Aug 15, 2025', time: '07:57 AM' }, customer: { name: 'Ahmed Aslam', id: '690-321' }, status: 'CANCELLED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025159', requestedAt: { date: 'Aug 15, 2025', time: '07:55 AM' }, customer: { name: 'Ahmed Aslam', id: '690-321' }, status: 'CANCELLED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025156', requestedAt: { date: 'Aug 14, 2025', time: '08:05 AM' }, customer: { name: 'Saina', id: '979-398' }, status: 'CANCELLED', noOfItems: 1 },
    { orderNo: 'SR/IN/2025152', requestedAt: { date: 'Aug 13, 2025', time: '04:51 PM' }, customer: { name: 'Ahmed Aslam', id: '690-321' }, status: 'PAID', noOfItems: 1 },
];

export const getRequestStatusColor = (status: string) => {
    switch (status) {
        case 'REQUESTED':
            return { color: '#f59e0b', bgColor: '#fef3c7' };
        case 'PAID':
            return { color: '#10b981', bgColor: '#d1fae5' };
        case 'CANCELLED':
            return { color: '#ef4444', bgColor: '#fee2e2' };
        case 'ORDER PLACED':
            return { color: '#8b5cf6', bgColor: '#ede9fe' };
        default:
            return { color: '#64748b', bgColor: '#f1f5f9' };
    }
};