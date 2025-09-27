import React from 'react';
import { Box } from '@mui/material';
import RequestDetails from './RequestDetails';
import TrackingStatus, { type Status } from '../../../components/common/Tracking/TrackingStatus';
import { formatDateTime } from '../../../utils/formatDateTime';

interface User {
  id: string;
  name: string;
}

interface TrackingRequest {
  id: string;
  status: string;
  created_at: string;
}

interface RequestData {
  details: any; 
  status: string;
  user: User;
  tracking_requests?: TrackingRequest[];
  [key: string]: any;
}

const PICKUP_TRACKING_STEPS = [
  { id: 'REQUESTED', title: 'Requested', description: 'Requested by {userName}' },
  { id: 'QUOTED', title: 'Quotation Ready', description: 'Quoted for {userName}', defaultDescription: 'Quotation is not ready yet!' },
  { id: 'CONFIRMED', title: 'Confirmed', description: 'Confirmed by {userName}', defaultDescription: 'Waiting for confirmation!' },
  { id: 'PICKED', title: 'Picked', description: 'Picked by {userName}', defaultDescription: 'Waiting for complete' },
];

const STATUS_TO_STEP_ID_MAPPING: Record<string, string> = {
  REQUESTED: 'REQUESTED',
  QUOTED: 'QUOTED',
  CONFIRMED: 'CONFIRMED',
  PICKED: 'PICKED',
};

const RequestDetailContent: React.FC<{ request: RequestData }> = ({ request }) => {
  //TODO: Needs to improve this code
  const prepareTrackingData = () => {
    const trackingHistory = request.tracking_requests || [];

    const statuses: Status[] = PICKUP_TRACKING_STEPS.map(step => {
      let description = step.defaultDescription || '';
      let date: string | undefined = undefined;
      let isComplete = false;
      const userName = request.user.name;

      const historyItem = trackingHistory.find(
        track => STATUS_TO_STEP_ID_MAPPING[track.status.toUpperCase()] === step.id
      );

      if (historyItem) {
        isComplete = true;
        date = historyItem.created_at;
      }
      
      if (isComplete) {
        //TODO: Its not correct way to replace the userName
        description = step.description.replace('{userName}', userName);
      }

      return {
        id: step.id,
        title: step.title,
        description,
        date: formatDateTime(date),
      };
    });
    
    const currentStageId = STATUS_TO_STEP_ID_MAPPING[request.status.toUpperCase()] || 'REQUESTED';
    
    return { statuses, currentStageId };
  };

  const { statuses, currentStageId } = prepareTrackingData();

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
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