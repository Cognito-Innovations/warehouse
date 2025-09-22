import React from 'react';
import { Box, Typography, Chip, Stack, Card, CardContent } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import StatusActionButtons from '../StatusActionButtons/StatusActionButtons';
import { FEATURE_CONFIG } from '../../utils/trackingConfig';
import type { Status } from '../../types';

interface PackageData {
  id: string;
  status: Status;
  customer: string;
  suite: string;
  email: string;
  phone: string;
  phone2: string;
  weight: string;
  items: any[];
  createdAt: string;
}

interface PackageHeaderProps {
  packageData: PackageData;
  actionLogStatus: string;
  onRefresh?: () => void;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({ 
  packageData,
  actionLogStatus,
  onRefresh,
}) => {
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
                label={packageData.status.value}
                size="small"
                sx={{
                  bgcolor: actionLogStatus === 'Action Required' ? '#f18d8d91' :
                    actionLogStatus === 'In Review' ? '#dbeafe' :
                      actionLogStatus === 'Ready To Send' ? '#dcfce7' : '#f18d8d91',
                  color: actionLogStatus === 'Action Required' ? '#ff4b41' :
                    actionLogStatus === 'In Review' ? '#1e40af' :
                      actionLogStatus === 'Ready To Send' ? '#166534' : '#ff4b41',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  borderRadius: 1
                }}
              />
            </Box>

            {/* Contact Information with Icons */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {packageData.customer && <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.customer} ({packageData.suite})
                </Typography>
              </Stack>}
              {packageData.email && packageData.email !== 'N/A' && <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.email}
                </Typography>
              </Stack>}
              {packageData.phone && packageData.phone !== 'N/A' && <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.phone}
                </Typography>
              </Stack>}
              {packageData.phone2 && packageData.phone2 !== 'N/A' && <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.phone2}
                </Typography>
              </Stack>}
            </Stack>
          </Box>
          
          <StatusActionButtons
            feature={FEATURE_CONFIG.PACKAGE}
            status={packageData.status.value}
            data={packageData}
            onRefresh={onRefresh}
          />

        </Box>
      </CardContent>
    </Card>
  );
};

export default PackageHeader;
