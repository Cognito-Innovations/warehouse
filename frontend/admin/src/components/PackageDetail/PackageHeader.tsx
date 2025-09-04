import React from 'react';
import { Box, Typography, Chip, Stack, Button, Card, CardContent } from '@mui/material';
import { Print as PrintIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';

interface PackageHeaderProps {
  packageData: {
    id: string;
    status: string;
    customer: string;
    suite: string; 
    email: string;
    phone: string;
    phone2: string;
  };
  actionLogStatus: string;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({ packageData, actionLogStatus }) => {
  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.5rem' }}>
                Package #: {packageData.id}
              </Typography>
              <Chip
                label={packageData.status}
                size="small"
                sx={{
                  bgcolor: actionLogStatus === 'Action Required' ? '#f18d8d91' :
                    actionLogStatus === 'In Review' ? '#dbeafe' :
                      actionLogStatus === 'Ready to Send' ? '#dcfce7' : '#f18d8d91',
                  color: actionLogStatus === 'Action Required' ? '#ff4b41' :
                    actionLogStatus === 'In Review' ? '#1e40af' :
                      actionLogStatus === 'Ready to Send' ? '#166534' : '#ff4b41',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  borderRadius: 1
                }}
              />
            </Box>

            {/* Contact Information with Icons */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.customer} ({packageData.suite})
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.email}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.phone}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.phone2}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Action Buttons - Stacked Vertically */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{
                bgcolor: '#8b5cf6',
                '&:hover': { bgcolor: '#7c3aed' },
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              Print Label
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{
                bgcolor: '#f97316',
                '&:hover': { bgcolor: '#ea580c' },
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              Discard
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PackageHeader;
