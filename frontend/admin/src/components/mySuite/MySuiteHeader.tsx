import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { LocationOnOutlined, PhoneOutlined, EmailOutlined, AccessTimeOutlined } from '@mui/icons-material';

const MySuiteHeader = () => (
  <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          UGFLASH INTERNATIONAL COURIER
        </Typography>
        <Stack spacing={1} color="text.secondary">
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnOutlined fontSize="small" />
            <Typography variant="body2">
              6/454, Ugflash Nagar, Amman Kovil Road, Perumagoundampatti, Elampillai, Salem, Tamil Nadu, 637502, India
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneOutlined fontSize="small" />
              <Typography variant="body2">+91 90429 99312</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailOutlined fontSize="small" />
              <Typography variant="body2">ugflash@shopme.mv</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeOutlined fontSize="small" />
              <Typography variant="body2">10:00 AM TO 06:00 PM (Sunday Closed)</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Button variant="contained" sx={{ textTransform: 'none', boxShadow: 'none' }}>
        Update Information
      </Button>
    </Stack>
  </Paper>
);

export default MySuiteHeader;