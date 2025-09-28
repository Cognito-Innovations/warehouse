import { 
  Box, 
  Stack, 
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { 
  EmailOutlined, 
  PhoneOutlined, 
} from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { User } from '../../types';

const CustomerHeader = ({ customer }: { customer: User }) => {
  const getStatusChip = (status: boolean, label: string) => (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: status ? '#dcfce7' : '#fef3c7',
        color: status ? '#16a34a' : '#f59e0b',
        fontWeight: 600,
        fontSize: '0.75rem'
      }}
    />
  );

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        mb: 3
      }}
    >
      {/* Header Section */}
      <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems="flex-start"
          gap={2}
        >
          <Box>
            <Typography 
              sx={{ 
                fontSize: '28px', 
                fontWeight: 600, 
                color: '#1e293b', 
                mb: 1 
              }}
            >
              {customer.name}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '16px', 
                fontWeight: 500, 
                color: '#64748b', 
                mb: 2 
              }}
            >
              Suite: {customer.suite_no}
            </Typography>

            {/* Customer Details */}
            <Stack spacing={1} color="#475569">
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <Stack direction="row" alignItems="center" spacing={0.8}>
                  <EmailOutlined sx={{ fontSize: '18px', color: '#475569' }} />
                  <Typography sx={{ fontSize: '14px' }}>{customer.email}</Typography>
                </Stack>
                
                {customer.id && (
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <BadgeIcon sx={{ fontSize: '18px', color: '#475569' }} />
                    <Typography sx={{ fontSize: '14px' }}>{customer.id}</Typography>
                  </Stack>
                )}
                
                {customer.gender && (
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <PersonIcon sx={{ fontSize: '18px', color: '#475569' }} />
                    <Typography sx={{ fontSize: '14px', textTransform: 'capitalize' }}>
                      {customer.gender}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                {customer.phone_number && (
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <PhoneOutlined sx={{ fontSize: '18px', color: '#475569' }} />
                    <Typography sx={{ fontSize: '14px' }}>{customer.phone_number}</Typography>
                  </Stack>
                )}
                
                {customer.dob && (
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <CalendarTodayIcon sx={{ fontSize: '18px', color: '#475569' }} />
                    <Typography sx={{ fontSize: '14px' }}>{customer.dob}</Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Box>

          {/* Status Chips */}
          <Stack direction="row" spacing={1} alignItems="center">
            {getStatusChip(customer.verified, 'Verified')}
            {getStatusChip(customer.isActive, 'Active')}
            {customer.provider && (
              <Chip
                label={customer.identifier}
                size="small"
                sx={{
                  bgcolor: '#e0e7ff',
                  color: '#3730a3',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Stack>
        </Stack>
      </Box>
      <Divider />
   
    </Box>
  );
};

export default CustomerHeader;