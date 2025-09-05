'use client';

import { Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { formatDateTime } from '@/lib/utils';

interface TrackingStatusProps {
  currentStatus: string;
  createdAt: string;
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({ currentStatus, createdAt }) => {
  const steps = [
    {
      key: 'REQUESTED',
      label: 'REQUESTED',
      description: formatDateTime(createdAt),
    },
    { 
        key: 'QUOTATION_READY', 
        label: 'QUOTATION READY', 
        description: 'Waiting for quotation' 
    },
    {
      key: 'QUOTATION_CONFIRMED',
      label: 'QUOTATION_CONFIRMED',
      description:'Waiting for confirmation',
    },
    { key: 'INVOICED', label: 'INVOICED', description: 'Waiting for invoice' },
    { key: 'PAYMENT_PENDING', label: 'PAYMENT PENDING', description: 'Waiting for payment' },
    { key: 'PAYMENT_APPROVED', label: 'PAYMENT APPROVED', description: 'Waiting for payment approval' },
    { key: 'ORDER_PLACED', label: 'ORDER PLACED', description: 'Placing order' },
  ];
      
  const activeIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Tracking
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {steps.map((step, index) => {
          const isActive = activeIndex === index;
          const isCompleted = activeIndex > index;

          return (
            <Box key={step.key} sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mr: 2,
                }}
              >
                {isCompleted || isActive ? (
                  <CheckCircle sx={{ color: '#3B82F6', zIndex: 1 }} />
                ) : (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid #BDBDBD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? '#3B82F6' : '#BDBDBD',
                      }}
                    />
                  </Box>
                )}

                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      width: '2px',
                      backgroundColor: isCompleted ? '#3B82F6' : '#E0E0E0',
                      minHeight: 24,
                    }}
                  />
                )}
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isActive ? '#3B82F6' : '#424242',
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isActive ? '#3B82F6' : 'text.secondary',
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default TrackingStatus;