import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import TrackingItem from './TrackingItem';
import { STATUS_HANDLERS } from '../../../utils/trackingHandlers';

const TRACKING_STEPS = [
  { label: 'Requested', defaultDescription: 'Requested by User' },
  { label: 'Quotation Ready', defaultDescription: 'Quotation is not ready yet!' },
  { label: 'Confirmed', defaultDescription: 'Waiting for confirmation!' },
  { label: 'Picked', defaultDescription: 'Waiting for complete' },
];

const TrackingStatus: React.FC = ({ details }) => {
  const normalizedStatus = details.status.replace(/_/g, ' ').toLowerCase();
  const statusToMatch = details.status === 'QUOTED' ? 'Quotation Ready'.toLowerCase() : normalizedStatus;

  const currentStatusIndex = TRACKING_STEPS.findIndex(
    step => step.label.toLowerCase() === statusToMatch
  );

  return (
    <>
      <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 3 }}>
        Tracking
      </Typography>

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: 3,
          borderRadius: 2,
          border: '1px solid #E0E0E0',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = currentStatusIndex >= 0 && index <= currentStatusIndex;
            
            const { description, date } =
              STATUS_HANDLERS[step.label]?.(details, step) ?? {
                description: step.defaultDescription,
              };
           
            return (
              <TrackingItem
                key={step.label}
                status={step.label}
                description={description}
                createdAt={date}
                completed={isCompleted}
                isLast={index === TRACKING_STEPS.length - 1}
              />
            );
          })}
        </Box>
      </Paper>
    </>
  );
};

export default TrackingStatus;
