import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import TrackingItem from './TrackingItem';

export interface Status {
  id: string | number;
  title: string;
  description: string;
  date?: string;
}

interface TrackingStatusProps {
  title?: string;
  statuses: Status[];
  currentStageId: string | number;
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({
  title = "Tracking",
  statuses,
  currentStageId,
}) => {
  const currentStageIndex = statuses.findIndex(status => status.id === currentStageId);

  return (
    <Box sx={{ pt: 1 }}>
      <Card sx={{ p: 3, pt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>
        {statuses.map((status, index) => {
          const isCompleted = currentStageIndex >= 0 && index <= currentStageIndex;

          return (
            <TrackingItem
              key={status.id}
              status={status.title}
              description={status.description}
              createdAt={isCompleted ? status.date : undefined}
              completed={isCompleted}
              isLast={index === statuses.length - 1}
            />
          );
        })}
      </Card>
    </Box>
  );
};

export default TrackingStatus;
