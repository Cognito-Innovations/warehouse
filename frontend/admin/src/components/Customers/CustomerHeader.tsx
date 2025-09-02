import { Box, Stack, Typography, Button } from '@mui/material';
import { EmailOutlined, PhoneOutlined } from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import type { Customer } from '../../data/customers';

const CustomerHeader = ({ customer }: { customer: Customer }) => (
  <Box
    sx={{
      bgcolor: '#f1f5f9',
      p: 3,
      borderRadius: 2,
      mb: 3
    }}
  >
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
            fontWeight: 500, 
            color: '#1e293b', 
            mb: 1 
          }}
        >
          {`${customer.name}, ${customer.suiteNo}`}
        </Typography>

        <Stack spacing={0.5} color="#475569">
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <EmailOutlined sx={{ fontSize: '18px', color: '#475569' }} />
              <Typography sx={{ fontSize: '14px' }}>{customer.email}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <BadgeIcon sx={{ fontSize: '18px', color: '#475569' }} />
              <Typography sx={{ fontSize: '14px' }}>{customer.id}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <PersonIcon sx={{ fontSize: '18px', color: '#475569' }} />
              <Typography sx={{ fontSize: '14px' }}>{customer.gender}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <PhoneOutlined sx={{ fontSize: '18px', color: '#475569' }} />
              <Typography sx={{ fontSize: '14px' }}>7722724</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <CalendarTodayIcon sx={{ fontSize: '18px', color: '#475569' }} />
              <Typography sx={{ fontSize: '14px' }}>{customer.dob}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={1.5} alignItems="flex-end">
        <Button 
          variant="outlined"
          sx={{ 
            borderColor: '#10b981',
            color: '#10b981',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            px: 3,
            py: 0.5,
            borderRadius: '20px',
            '&:hover': {
              borderColor: '#059669',
              color: '#059669'
            }
          }}
        >
          Add offer
        </Button>
        <Button
          variant="contained"
          sx={{ 
            bgcolor: '#7c3aed', 
            '&:hover': { bgcolor: '#6d28d9' }, 
            boxShadow: 'none',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            px: 3,
            py: 0.5,
            borderRadius: '6px'
          }}
        >
          Update Information
        </Button>
      </Stack>
    </Stack>
  </Box>
);

export default CustomerHeader;