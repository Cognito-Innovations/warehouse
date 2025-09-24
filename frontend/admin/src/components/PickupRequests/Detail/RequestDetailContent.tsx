import React from 'react';
import { Box } from '@mui/material';
import RequestDetails from './RequestDetails';
import TrackingStatus, { type Status } from '../../../components/common/Tracking/TrackingStatus';
import { STATUS_HANDLERS } from '../../../utils/trackingHandlers';

interface RequestData {
  details: any; 
  status: string;
  trackingHistory: any[];
}

const PICKUP_TRACKING_STEPS = [
  { id: 'REQUESTED', title: 'Requested', defaultDescription: 'Requested by User' },
  { id: 'QUOTED', title: 'Quotation Ready', defaultDescription: 'Quotation is not ready yet!' },
  { id: 'CONFIRMED', title: 'Confirmed', defaultDescription: 'Waiting for confirmation!' },
  { id: 'PICKED', title: 'Picked', defaultDescription: 'Waiting for complete' },
];

const RequestDetailContent: React.FC<{ request: RequestData }> = ({ request }) => {
  const prepareTrackingData = () => {
    const statuses: Status[] = PICKUP_TRACKING_STEPS.map(step => {
      const { description, date } = STATUS_HANDLERS[step.title]?.(request, step) ?? {
        description: step.defaultDescription,
        date: undefined,
      };

      return {
        id: step.id,
        title: step.title,
        description,
        date,
      };
    });
    
    const statusMap: Record<string, string> = {
      requested: "REQUESTED",
      quoted: "QUOTED",
      confirmed: "CONFIRMED",
      picked: "PICKED",
    };
    const currentStageId = statusMap[request.status.toLowerCase()] || 'REQUESTED';
    
    return { statuses, currentStageId };
  };

  const { statuses, currentStageId } = prepareTrackingData();

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' },
          gap: 3,
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Box>
          <RequestDetails details={request} />
        </Box>

        <Box>
          <TrackingStatus statuses={statuses} currentStageId={currentStageId} />
        </Box>
      </Box>
    </Box>
  );
}

export default RequestDetailContent;