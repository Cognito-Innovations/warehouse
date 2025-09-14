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
  const normalizedStatus = details.status.toLowerCase();

  const statusMap: Record<string, string> = {
    requested: "requested",
    quoted: "quotation ready",
    confirmed: "confirmed",
    picked: "picked",
  };

  const statusToMatch = statusMap[normalizedStatus] ?? normalizedStatus;
 
  const currentStatusIndex = TRACKING_STEPS.findIndex(
    step => step.label.toLowerCase() === statusToMatch
  );

  return (
    <>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700,
          mb: 3,
          fontSize: '1.25rem',
          color: 'text.primary',
          letterSpacing: '0.025em',
        }}
      >
        Tracking
      </Typography>

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: 3,
          borderRadius: 2.5,
          border: '1px solid rgba(0,0,0,0.06)',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
