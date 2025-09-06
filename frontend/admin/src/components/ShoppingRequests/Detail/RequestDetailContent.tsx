import { Box, useMediaQuery, useTheme } from '@mui/material';
import CustomerInfo from './CustomerInfo';
import ItemsTable from './ItemsTable';
import TrackingStatus from './TrackingStatus';
import ActionLogs from './ActionLogs';
import PaymentSlipsCard from './PaymentSlipsCard';

interface RequestData {
  details: any; 
  status: string;
  payment_slips?: string[];
  onStatusUpdated?: () => void;
}

interface RequestDetailContentProps {
  request: RequestData;
  onStatusUpdated?: () => void;
}

const RequestDetailContent: React.FC<RequestDetailContentProps> = ({ request, onStatusUpdated }) => {
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
          <CustomerInfo details={request}/>

          {(request.status === "PAYMENT_PENDING" || request.status === "PAYMENT_APPROVED") && (
            <PaymentSlipsCard 
              details={request.payment_slips || []} 
              onStatusUpdated={onStatusUpdated || (() => {})} 
            />
          )}

          <ItemsTable details={request} />
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
        <ActionLogs />
      </Box>
    </Box>
  );
};

export default RequestDetailContent;