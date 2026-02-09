import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { getShipmentsByShipmentNo, updateShipmentStatus } from '../services/api.services.ts';
import TopNavbar from '../components/Layout/TopNavbar.tsx';
import ShipmentDetailsSection from '../components/Shipments/Detail/ShipmentDetailsSection.tsx';
import PackagesSection from '../components/Shipments/Detail/PackagesSection.tsx';
import ShipmentsPhotosSection from '../components/Shipments/Detail/ShipmentsPhotosSection.tsx';
import ShippingAddress from '../components/Shipments/Detail/ShippingAddress.tsx';
import TrackingStatus from '../components/common/Tracking/TrackingStatus.tsx';
import ActionLogs from '../components/Shipments/Detail/ActionLogs.tsx';
import ShipmentHeader from '../components/Shipments/Detail/ShipmentHeader.tsx';
import InvoiceTable from '../components/ShoppingRequests/Detail/InvoiceTable.tsx';
import { SHIPMENT_STATUS_TO_STEP_ID_MAPPING, SHIPMENT_TRACKING_STEPS } from '../utils/trackingSteps.ts';
import { formatDateTime } from '../utils/formatDateTime.ts';
import { formatWithPlaceholders } from '../utils/formatPlaceholder.ts';

const ShipmentDetail: React.FC = () => {
  const { shipment_no } = useParams();
  const [shipments, setShipments] = useState<any | null>(null);
  const [isApprovingPayment, setIsApprovingPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchShipments = useCallback(async () => {
    if (!shipment_no) return;
    setLoading(true);
    try {
      const data = await getShipmentsByShipmentNo(shipment_no);
      setShipments(data);
    } catch (err) {
      console.error("Error fetching shopping request:", err);
    } finally {
      setLoading(false);
    }
  }, [shipment_no]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleApprovePayment = async (id: string) => {
    if (!id) return;
    setIsApprovingPayment(true);
    try {
      await updateShipmentStatus(id, "PAYMENT_APPROVED")
      await fetchShipments()
      toast.success('Payment approved successfully!');
    } catch (err) {
      console.error('Failed to approve payment:', err);
      toast.error('Failed to approve payment.');
    } finally {
      setIsApprovingPayment(false);
    }
  };

  const getTrackingViewData = (shipment: any) => {
    const isRejected = shipment.status.toUpperCase() === 'REJECTED';

    let statuses = buildTrackingStatuses(shipment);

    const currentStageId = resolveCurrentTrackingStage(shipment.status, statuses);

    if (isRejected) statuses = applyRejectedState(statuses, currentStageId);

    return { statuses, currentStageId };
  };

  const buildTrackingStatuses = (shipment: any) => {
    const history = shipment.tracking_requests || [];
    const userName = shipment.user?.name;

    return SHIPMENT_TRACKING_STEPS.map(step => {
      const historyItem = history.find(
        h => SHIPMENT_STATUS_TO_STEP_ID_MAPPING[h.status] === step.id
      );

      const isComplete = Boolean(historyItem);
      const date = historyItem?.created_at;

      return {
        id: step.id,
        title: step.title,
        description: isComplete
          ? formatWithPlaceholders(step.description, { userName })
          : step.defaultDescription || '',
        date: formatDateTime(date),
      };
    });
  };

  const resolveCurrentTrackingStage = (shipmentStatus: string, statuses: any[]) => {
    const mappedStage = SHIPMENT_STATUS_TO_STEP_ID_MAPPING[shipmentStatus.toLowerCase()];
    if (mappedStage) return mappedStage;

    const lastCompleted = [...statuses]
      .reverse()
      .find(status => status.date && status.date.trim() !== '');

    return lastCompleted?.id ?? 'ship_request';
  };

  const applyRejectedState = (statuses: any[], currentStageId: string) => {
    const currentIndex = statuses.findIndex(status => status.id === currentStageId);
    if (currentIndex === -1) return statuses;

    return statuses.map((status, index) => {
      if (index <= currentIndex) return status;

      const originalStep = SHIPMENT_TRACKING_STEPS.find(s => s.id === status.id);
      return {
        ...status,
        date: formatDateTime(undefined),
        description: originalStep?.defaultDescription || '',
      };
    });
  };
  
  if (loading || !shipments) {
    return (
      <Box sx={{ p: 1 }}>
        <TopNavbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const { statuses, currentStageId } = getTrackingViewData(shipments);
  const showInvoiceTable = ["PAYMENT_PENDING", "PAYMENT_APPROVAL_PENDING", "PAYMENT_APPROVED", "READY_TO_SHIP", "DEPARTED", "DISCARDED"]
    .includes(shipments.status);

  const isDiscarded = shipments.status === 'DISCARDED';
  const showDiscardedMessage = isDiscarded && (
    <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
      This shipment has been discarded. No further actions can be taken.
    </Alert>
  );

  return (
    <Box sx={{ p: 1 }}>
      <TopNavbar
        pageTitle="Shipments"
        pageSubtitle={shipment_no}
      />
      {showDiscardedMessage}

      <ShipmentHeader 
        shipments={shipments}
        onRefresh={fetchShipments}
        isDiscarded={isDiscarded}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}  sx={{ mt: 2 }}>
          <ShipmentDetailsSection 
            shipments={shipments}
            loading={loading}
            onRefresh={fetchShipments}
            isDiscarded={isDiscarded}
          />

          <PackagesSection
            packages={shipments?.packages}
            shipmentId={shipments?.id}
            onPackageRemoved={fetchShipments} 
            isDiscarded={isDiscarded}
          />

          {showInvoiceTable && (
            <InvoiceTable
              invoice={shipments.invoice}
              payment_slips={shipments.payment_slips}
              status={shipments.status}
              isApprovingPayment={isApprovingPayment}
              onApprovePayment={() => handleApprovePayment(shipments.id)} 
              isDiscarded={isDiscarded}
            />
          )}           
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ShippingAddress
            shipments={shipments}
          />

          <ShipmentsPhotosSection 
            shipments={shipments}
            documents={shipments.shipment_photos || []}
            onUploadSuccess={fetchShipments}
            isDiscarded={isDiscarded}
          />

          <TrackingStatus
            statuses={statuses}
            currentStageId={currentStageId}
          />

          <ActionLogs isDiscarded={isDiscarded}/> 
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShipmentDetail;