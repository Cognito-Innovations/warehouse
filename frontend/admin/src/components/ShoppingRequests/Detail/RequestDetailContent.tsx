import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { updateShoppingRequestStatus } from '../../../services/api.services';
import ItemsTable from './ItemsTable';
import TrackingStatus, { type Status } from '../../../components/common/Tracking/TrackingStatus';
import InvoiceTable from './InvoiceTable';
import CustomerRemarks from '../../common/CustomerRemarks';
import { formatDateTime } from '../../../utils/formatDateTime';
import { formatWithPlaceholders } from '../../../utils/formatPlaceholder';
import { SHOPPING_STATUS_TO_STEP_ID_MAPPING, SHOPPING_TRACKING_STEPS } from '../../../utils/trackingSteps';

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

const RequestDetailContent: React.FC<RequestDetailContentProps> = ({
  request,
  onStatusUpdated,
  onItemUpdate,
  onSelectionChange,
  selectedItemIds
}) => {
  const [isApprovingPayment, setIsApprovingPayment] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showInvoiceTable = ["PAYMENT_PENDING", "PAYMENT_APPROVED", "ORDER_PLACED"];

  const handleApprovePayment = async (id: string) => {
    try {
      setIsApprovingPayment(true);
      await updateShoppingRequestStatus(id, "PAYMENT_APPROVED");
      onStatusUpdated?.();
    } catch (error) {
      console.error("Failed to approve payment", error);
    } finally {
      setIsApprovingPayment(false);
    }
  };

  const prepareTrackingData = () => {
    const statuses = buildTrackingStatuses(request);
    const currentStageId = getCurrentStageId(request, statuses);

    if (request.status.toUpperCase() === 'REJECTED') {
      return {
        statuses: resetFutureStepsForRejected(statuses, currentStageId),
        currentStageId,
      };
    }

    return { statuses, currentStageId };
  };

  const getTrackingHistoryItem = (stepId: string, trackingHistory: TrackingRequest[]) => {
    return trackingHistory.find(track => {
      const upperCaseStatus = track.status.toUpperCase();
      const mappedStepId = SHOPPING_STATUS_TO_STEP_ID_MAPPING[upperCaseStatus];

      return (
        String(mappedStepId) === stepId ||
        upperCaseStatus === stepId
      );
    });
  };

  const resolveStepCompletion = ({
    stepId,
    historyItem,
    request,
    isRejected,
    isComplete,
  }: {
    stepId: string;
    historyItem?: TrackingRequest;
    request: RequestData;
    isRejected: boolean;
    isComplete: boolean;
  }) => {
    if (historyItem) {
      return {
        isComplete: true,
        date: historyItem.created_at,
      };
    }

    if (isRejected) return { isComplete, date: undefined };

    switch (stepId) {
      case 'QUOTATION_CONFIRMED':
        if (request.invoice) {
          return {
            isComplete: true,
            date: request.invoice.created_at,
          };
        }
        break;

      case 'PAYMENT_PENDING':
        if (request.payment_slips?.length) {
          return {
            isComplete: true,
            date: request.payment_slips[0].created_at,
          };
        }
        break;
    }

    return { isComplete, date: undefined };
  };

  const buildTrackingStatuses = (request: RequestData): Status[] => {
    const trackingHistory = request.tracking_requests || [];
    const isRejected = request.status.toUpperCase() === 'REJECTED';

    return SHOPPING_TRACKING_STEPS.map(step => {
      let description = step.defaultDescription || '';
      const userName = request.user.name;
      let isComplete = false;

      const historyItem = getTrackingHistoryItem(step.id, trackingHistory);

      const resolved = resolveStepCompletion({
        stepId: step.id,
        historyItem,
        request,
        isRejected,
        isComplete,
      });

      isComplete = resolved.isComplete;
      const date = resolved.date;

      if (isComplete) {
        description = formatWithPlaceholders(step.description, { userName });
      }

      return {
        id: step.id,
        title: step.title,
        description,
        date: formatDateTime(date),
      };
    });
  };

  const getCurrentStageId = (request: RequestData, statuses: Status[]) => {
    const isRejected = request.status.toUpperCase() === 'REJECTED';
    const upperCaseStatus = request.status.toUpperCase();
    const mappedId = SHOPPING_STATUS_TO_STEP_ID_MAPPING[upperCaseStatus];

    if (mappedId && !isRejected) {
      return String(mappedId);
    }

    const lastCompletedStep = [...statuses]
      .reverse()
      .find(s => s.date && s.date.trim() !== '');

    return String(lastCompletedStep?.id) || 'REQUESTED';
  };

  const resetFutureStepsForRejected = (statuses: Status[], currentStageId: string) => {
    const currentIndex = statuses.findIndex(status => status.id === currentStageId);

    if (currentIndex === -1) return statuses;

    return statuses.map((status, index) => {
      if (index <= currentIndex) return status;

      const originalStep = SHOPPING_TRACKING_STEPS.find(
        step => step.id === String(status.id)
      );

      return {
        ...status,
        date: formatDateTime(undefined),
        description: originalStep?.defaultDescription || '',
      };
    });
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
              invoice={request.invoice}
              payment_slips={request.payment_slips || []}
              status={request.status}
              isApprovingPayment={isApprovingPayment}
              onApprovePayment={() => handleApprovePayment(request.id)}
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