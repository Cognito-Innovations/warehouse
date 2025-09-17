import { Box, useMediaQuery, useTheme } from '@mui/material';
import ItemsTable from './ItemsTable';
import TrackingStatus from './TrackingStatus';
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

const RequestDetailContent: React.FC<RequestDetailContentProps> = ({
  request,
  onStatusUpdated,
  onItemUpdate,
  onSelectionChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      gap: 3,
      width: '100%',
      padding: "16px"
    }}>
      {/* Left Content - 70% on desktop, full width on mobile */}
      <Box sx={{ 
        flex: isMobile ? '1' : '0 0 70%',
        minWidth: 0, // Prevents flex item from overflowing
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

      {/* Right Content - 30% on desktop, full width on mobile */}
      <Box sx={{ 
        flex: isMobile ? '1' : '0 0 28%',
        minWidth: 0, // Prevents flex item from overflowing
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <TrackingStatus details={request} />
        {/* TODO: Uncomment when functionality is implemented */}
        {/* <ActionLogs />  */}
      </Box>
    </Box>
  );
};

export default RequestDetailContent;