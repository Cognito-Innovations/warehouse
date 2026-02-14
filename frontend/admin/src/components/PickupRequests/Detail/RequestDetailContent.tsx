import React from 'react';
import { Box } from '@mui/material';

import RequestDetails from './RequestDetails';
import TrackingStatus, { type Status } from '../../../components/common/Tracking/TrackingStatus';
import { formatDateTime } from '../../../utils/formatDateTime';
import { formatWithPlaceholders } from '../../../utils/formatPlaceholder';
import { PICKUP_STATUS_TO_STEP_ID_MAPPING, PICKUP_TRACKING_STEPS } from '../../../utils/trackingSteps';
import type { PickupRequestData, TrackingRequest } from '../../../types';

const RequestDetailContent: React.FC<{ request: PickupRequestData }> = ({ request }) => {
  const prepareTrackingData = () => {
    const statuses = buildTrackingStatuses(request);

    const currentStageId = getCurrentStageId(request, statuses);
    
    resetFutureStepsIfRejected(request, statuses, currentStageId);

    return { statuses, currentStageId };
  };

  const findHistoryItemForStep = (stepId: string, trackingHistory: TrackingRequest[]) => {
    return trackingHistory.find(track => {
      const upperCaseStatus = track.status.toUpperCase();
      return (
        PICKUP_STATUS_TO_STEP_ID_MAPPING[upperCaseStatus] === stepId ||
        upperCaseStatus === stepId
      );
    });
  };

  const buildTrackingStatuses = (request: PickupRequestData): Status[] => {
    const trackingHistory = request.tracking_requests || [];
    const userName = request.user.name;

    return PICKUP_TRACKING_STEPS.map(step => {
      const historyItem = findHistoryItemForStep(step.id, trackingHistory);

      const isComplete = Boolean(historyItem);
      const date = historyItem?.created_at;

      const description = isComplete
        ? formatWithPlaceholders(step.description, { userName })
        : step.defaultDescription || '';

      return {
        id: step.id,
        title: step.title,
        description,
        date: formatDateTime(date),
      };
    });
  };

  const getCurrentStageId = (request: PickupRequestData, statuses: Status[]): string => {
    const upperCaseStatus = request.status.toUpperCase();
    const isRejected = upperCaseStatus === 'REJECTED';
    const mappedId = PICKUP_STATUS_TO_STEP_ID_MAPPING[upperCaseStatus];

    if (mappedId && !isRejected) return mappedId;

    const lastCompletedStep = [...statuses]
      .reverse()
      .find(status => status.date && status.date.trim() !== '');

    return lastCompletedStep ? (lastCompletedStep.id as string) : 'REQUESTED';
  };

  const resetFutureStepsIfRejected = (
    request: PickupRequestData,
    statuses: Status[],
    currentStageId: string
  ) => {
    const isRejected = request.status.toUpperCase() === 'REJECTED';

    if (!isRejected) return;

    const currentStageIndex = statuses.findIndex(
      status => status.id === currentStageId
    );

    if (currentStageIndex === -1) return;

    for (let stageIndex = currentStageIndex + 1; stageIndex < statuses.length; stageIndex++) {
      const originalStep = PICKUP_TRACKING_STEPS.find(
        status => status.id === statuses[stageIndex].id
      );

      statuses[stageIndex].date = formatDateTime(undefined);
      statuses[stageIndex].description = originalStep?.defaultDescription || '';
    }
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