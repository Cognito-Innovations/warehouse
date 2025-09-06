export const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return 'REQUESTED';
      case 'QUOTATION_READY':
        return 'QUOTATION READY';
      case 'QUOTATION_CONFIRMED':
        return 'QUOTATION CONFIRMED';
      case 'PAYMENT_PENDING':
        return 'PAYMENT PENDING';
      case 'PAYMENT_APPROVED':
        return 'PAID';
      case 'INVOICED':
        return 'INVOICED';
      case 'ORDER_PLACED':
        return 'ORDER PLACED';
      case 'CANCELLED':
        return 'CANCELLED';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return status; 
        
    }
  };
export const getRequestStatusColor = (status: string) => {
    switch (status) {
        case 'REQUESTED':
        case 'PAYMENT_PENDING':
            return { color: '#f59e0b', bgColor: '#fef3c7' };
        case 'QUOTATION_READY':
        case 'QUOTATION_CONFIRMED':
        case 'PAYMENT_APPROVED':          
        case 'INVOICED':  
            return { color: '#10b981', bgColor: '#d1fae5' };
        case 'CANCELLED':
            return { color: '#ef4444', bgColor: '#fee2e2' };
        case 'ORDER_PLACED':
            return { color: '#8b5cf6', bgColor: '#ede9fe' };
        default:
            return { color: '#64748b', bgColor: '#f1f5f9' };
    }
};