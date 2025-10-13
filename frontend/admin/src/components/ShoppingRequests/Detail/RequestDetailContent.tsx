import { Box, useMediaQuery, useTheme } from '@mui/material';
import ItemsTable from './ItemsTable';
import TrackingStatus, { type Status } from '../../../components/common/Tracking/TrackingStatus';
import InvoiceTable from './InvoiceTable';
import CustomerRemarks from '../../common/CustomerRemarks';
import { formatDateTime } from '../../../utils/formatDateTime';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  suite_no?: string;
  verified: boolean;
}

export interface Product {
  id: string;
  shopping_request_id: string;
  name: string;
  description?: string | null;
  unit_price: number | null;
  quantity: number;
  url?: string;
  size?: string;
  color?: string;
  variants?: string;
  if_not_available_quantity?: string;
  if_not_available_color?: string;
  available: boolean;
  currency?: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface Invoice {
  id: string;
  invoice_no: string;
  amount: number;
  total: number;
  status: string;
  products: Product[];
  created_at: string;
  updated_at: string;
}

export interface PaymentSlip {
  id: string;
  document_name: string;
  document_url: string;
  document_type: string;
  category: string;
  file_size: number;
  mime_type: string;
  amount: number;
  status?: string;
  created_at: string;
  updated_at: string;
}

interface TrackingRequest {
  status: string;
  created_at: string;
  [key: string]: unknown;
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
  tracking_requests?: TrackingRequest[];
  invoice?: Invoice;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

interface RequestDetailContentProps {
  request: RequestData;
  onStatusUpdated?: () => void;
  onItemUpdate: (itemId: string, updates: Partial<Product>) => void;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
  selectedItemIds: Set<string>;
}

const SHOPPING_TRACKING_STEPS = [
  { id: 'REQUESTED', title: 'Requested', description: 'Requested by {userName}' },
  { id: 'QUOTED', title: 'Quotation Ready', description: 'Quoted for {userName}', defaultDescription: 'Quotation is not ready yet!' },
  { id: 'QUOTATION_CONFIRMED', title: 'Quotation Confirmed', description: 'Quotation Confirmed by {userName}', defaultDescription: 'Quotation is not confirmed yet!' },
  { id: 'INVOICED', title: 'Invoiced', description: 'Invoice raised by {userName}', defaultDescription: 'Waiting for raise invoice' },
  { id: 'PAYMENT_PENDING', title: 'Pending Payment Approval', description: 'Payment slip uploaded by {userName}', defaultDescription: 'Waiting for upload payment slip' },
  { id: 'PAYMENT_APPROVED', title: 'Payment Approved', description: 'Payment Approved by {userName}', defaultDescription: 'Waiting for payment approval' },
  { id: 'ORDER_PLACED', title: 'Order placed', description: 'Order Placed by {userName}', defaultDescription: 'Waiting for complete' },
];

const STATUS_TO_STEP_ID_MAPPING: Record<string, string> = {
  REQUESTED: 'REQUESTED',
  QUOTATION_READY: 'QUOTED',
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
  selectedItemIds
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showInvoiceTable = ["PAYMENT_PENDING", "PAYMENT_APPROVED", "ORDER_PLACED"];

  const prepareTrackingData = () => {
    const trackingHistory = request.tracking_requests || [];
    const isRejected = request.status.toUpperCase() === 'REJECTED';
    
    const statuses: Status[] = SHOPPING_TRACKING_STEPS.map(step => {
      let description = step.defaultDescription || '';
      let date: string | undefined = undefined;
      let isComplete = false;
      let userName = request.user.name;

      const historyItem = trackingHistory.find(track => {
      const upperCaseStatus = track.status.toUpperCase();
        return STATUS_TO_STEP_ID_MAPPING[upperCaseStatus] === step.id || upperCaseStatus === step.id;
      });

      if (historyItem) {
        isComplete = true;
        date = historyItem.created_at;
      }

      if (!isRejected) {
        switch (step.id) {
          case 'QUOTATION_CONFIRMED':
            if (request.invoice && !isComplete) {
              isComplete = true;
              date = request.invoice.created_at;
              userName = request.user.name;
            }
            break;
          case 'PAYMENT_PENDING':
            if (request.payment_slips && request.payment_slips.length > 0 && !isComplete) {
              isComplete = true;
              date = request.payment_slips[0].created_at;
              userName = request.user.name;
            }
            break;
          default:
            break;
        }
      }
    
      if (isComplete) {
        description = step.description.replace('{userName}', userName);
      }

      return {
        id: step.id,
        title: step.title,
        description,
        date: formatDateTime(date),
      };
    });
    
    let currentStageId: string;
    const upperCaseStatus = request.status.toUpperCase();
    const mappedId = STATUS_TO_STEP_ID_MAPPING[upperCaseStatus];

    if (mappedId && !isRejected) {
      currentStageId = mappedId;
    } else {
      const lastCompletedStep = [...statuses].reverse().find(s => s.date && s.date.trim() !== '');
      currentStageId = lastCompletedStep ? (lastCompletedStep.id as string) : 'REQUESTED';
    }

    if (isRejected) {
      const currentStageIndex = statuses.findIndex(s => s.id === currentStageId);

      if (currentStageIndex > -1) {
        for (let i = currentStageIndex + 1; i < statuses.length; i++) {
          const originalStep = SHOPPING_TRACKING_STEPS.find(s => s.id === statuses[i].id);

          statuses[i].date = formatDateTime(undefined);
          statuses[i].description = originalStep?.defaultDescription || '';
        }
      }
    }

    return { statuses, currentStageId };
  };

  const { statuses, currentStageId } = prepareTrackingData();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      gap: 3,
      width: '100%',
      alignItems: 'flex-start'
    }}>
      <Box sx={{ 
        flex: isMobile ? '1' : '0 0 70%',
        minWidth: 0,
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {request?.remarks && <CustomerRemarks remarks={request.remarks} />}

          <ItemsTable 
            details={request}
            onItemUpdate={onItemUpdate}
            onSelectionChange={onSelectionChange}
            selectedItemIds={selectedItemIds}
          />

          {showInvoiceTable.includes(request.status) && request.invoice && (
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