export const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'REQUESTED':
    case 'DRAFT':
    case 'NO':
    case 'PAYMENT PENDING':
    case 'PAYMENT_PENDING':
    case 'INACTIVE':
    case 'PROCESSING':
      return { color: '#F59E0B', bgColor: '#FEF3C7' }; // Amber
    
    case 'QUOTATION_READY':
    case 'QUOTATION_CONFIRMED':
    case 'PAYMENT APPROVED':
    case 'PAYMENT_APPROVED':          
    case 'INVOICED':  
      return { color: '#10b981', bgColor: '#d1fae5' };
    
    case 'CANCELLED':
    case 'REJECTED':
      return { color: '#DC2626', bgColor: '#FEE2E2' }; // Red
    
    case 'QUOTED':
    case 'CONFIRMED':
    case 'PAID':
    case 'ACTIVE':  
    case 'DELIVERED':
      return { color: '#059669', bgColor: '#D1FAE5' }; // Green
    
    case 'ACCEPTED':
    case 'PICKED':
    case 'SHIPPED':
      return { color: '#2563EB', bgColor: '#DBEAFE' }; // Blue
    
    case 'READY TO SEND':
    case 'READY_TO_SHIP':
    case 'READY TO SHIP':
      return { color: '#22c55e', bgColor: '#dcfce7' };
    
    case 'ACTION REQUIRED':
    case 'PENDING':
      return { color: '#ef4444', bgColor: '#fee2e2' };
    
    case 'IN REVIEW':
      return { color: '#3b82f6', bgColor: '#dbeafe' };
    
    case 'REQUEST_SHIP':
    case 'REQUEST SHIP':
      return { color: '#ff9800', bgColor: '#fff3e0' };
    
    case 'DEPARTED':
    case 'SHIPMENTS DEPARTED':
      return { color: '#9c27b0', bgColor: '#f3e5f5' };
    
    case 'DISCARDED':
      return { color: '#d32f2f', bgColor: '#ffebee' };
    
    case 'ORDER_PLACED':
      return { color: '#4F46E5', bgColor: '#E0E7FF' }; // Indigo
    
    case 'EXPORT GENERATED':
      return { color: '#64748b', bgColor: '#f1f5f9' };
    
    case 'YES':
      return { color: '#16a34a', bgColor: '#dcfce7' }

    default:
      return { color: '#6B7280', bgColor: '#F3F4F6' }; // Gray
  }
};