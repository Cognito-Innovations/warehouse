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
