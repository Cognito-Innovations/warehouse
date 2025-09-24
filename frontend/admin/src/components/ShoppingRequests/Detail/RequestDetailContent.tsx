import { Box, useMediaQuery, useTheme } from '@mui/material';
import ItemsTable from './ItemsTable';
import TrackingStatus, { type Status } from '../../../components/common/Tracking/TrackingStatus';
import InvoiceTable from './InvoiceTable';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  suite_no?: string;
  verified: boolean;
}

interface Product {
  id: string;
  shopping_request_id: string;
  name: string;
  description?: string | null;
  unit_price: string;
  quantity: number;
  url?: string;
  size?: string;
  color?: string;
  variants?: string;
  if_not_available_quantity?: string;
  if_not_available_color?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

interface Invoice {
  id: string;
  invoice_no: string;
  amount: string;
  total: string;
  status: string;
  products: Product[];
  created_at: string;
  updated_at: string;
}

interface PaymentSlip {
  id: string;
  document_name: string;
  document_url: string;
  document_type: string;
  category: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface RequestData {
  id: string;
  user_id: string;
  user: User;
  request_code: string;
  country: string;
  items: number;
  shopping_request_products: Product[];
  remarks?: string;
  status: string;
  payment_slips?: PaymentSlip[];
  tracking_requests?: any[];
  invoice?: Invoice;
  created_at: string;
  updated_at: string;
}

interface RequestDetailContentProps {
  request: RequestData;
  onStatusUpdated?: () => void;
  onItemUpdate: (index: number, updates: any) => void;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
}

const SHOPPING_TRACKING_STEPS = [
  { id: 'REQUESTED', title: 'Requested', defaultDescription: 'Requested by User' },
  { id: 'QUOTED', title: 'Quotation Ready', defaultDescription: 'Quotation is not ready yet!' },
  { id: 'QUOTATION_CONFIRMED', title: 'Quotation Confirmed', defaultDescription: 'Quotation is not confirmed yet!' },
  { id: 'INVOICED', title: 'Invoiced', defaultDescription: 'Waiting for confirmation!' },
  { id: 'PAYMENT_PENDING', title: 'Pending Payment Approval', defaultDescription: 'Waiting for upload payment slip' },
  { id: 'PAYMENT_APPROVED', title: 'Payment Approved', defaultDescription: 'Waiting for payment approval' },
  { id: 'ORDER_PLACED', title: 'Order placed', defaultDescription: 'Waiting for complete' },
];

const STATUS_TO_STEP_ID_MAPPING: Record<string, string> = {
  REQUESTED: 'REQUESTED',
  QUOTED: 'QUOTED',
  QUOTATION_CONFIRMED: 'QUOTATION_CONFIRMED',
  INVOICED: 'INVOICED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAYMENT_APPROVED: 'PAYMENT_APPROVED',
  ORDER_PLACED: 'ORDER_PLACED',
};

const RequestDetailContent: React.FC<RequestDetailContentProps> = ({
  request,
  onStatusUpdated,
  onItemUpdate,
  onSelectionChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const prepareTrackingData = () => {
    const trackingHistory = request.tracking_requests || [];
    
    const statuses: Status[] = SHOPPING_TRACKING_STEPS.map(step => {
      const historyItem = trackingHistory.find(
        track => STATUS_TO_STEP_ID_MAPPING[track.status.toUpperCase()] === step.id
      );
      
      const fallbackItem =
        step.id === 'QUOTATION_CONFIRMED'
          ? trackingHistory.find(track => track.status.toUpperCase() === 'INVOICED')
        : step.id === 'PAYMENT_PENDING'
          ? trackingHistory.find(track => track.status.toUpperCase() === 'PAYMENT_PENDING')
        : undefined;
          
      const effectiveItem = historyItem || fallbackItem;

      return {
        id: step.id,
        title: step.title,
        description: effectiveItem ? `Status updated to ${step.title}` : step.defaultDescription,
        date: effectiveItem?.created_at,
      };
    });
    
    const currentStageId = STATUS_TO_STEP_ID_MAPPING[request.status.toUpperCase()] || 'REQUESTED';

    return { statuses, currentStageId };
  };

  const { statuses, currentStageId } = prepareTrackingData();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      gap: 3,
      width: '100%',
      padding: "16px"
    }}>
      <Box sx={{ 
        flex: isMobile ? '1' : '0 0 70%',
        minWidth: 0,
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          <ItemsTable 
            details={request}
            onItemUpdate={onItemUpdate}
            onSelectionChange={onSelectionChange}
          />

          {(request.status === "PAYMENT_PENDING" || request.status === "PAYMENT_APPROVED") && request.invoice && (
            <InvoiceTable 
              id={request.id}
              invoice={request.invoice}
              payment_slips={request.payment_slips || []}
              status={request.status}
              onStatusUpdated={onStatusUpdated || (() => {})} 
            />
          )}
        </Box>
      </Box>

      <Box sx={{ 
        flex: isMobile ? '1' : '0 0 28%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <TrackingStatus statuses={statuses} currentStageId={currentStageId} />
        
        {/* TODO: Uncomment when functionality is implemented */}
        {/* <ActionLogs />  */}
      </Box>
    </Box>
  );
};

export default RequestDetailContent;