import { Paper, Stack, Box, Typography } from '@mui/material';

const CustomerAddressList = () => (
  <Box>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
      <Box>
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '18px', color: '#1e293b' }}>
          Address List
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '14px', color: '#94a3b8' }}>
          Shipping Addresses
        </Typography>
      </Box>
    </Stack>
    
    <Paper 
      variant="outlined" 
      sx={{ 
        borderRadius: 2,
        borderColor: '#e2e8f0',
        bgcolor: '#ffffff',
        minWidth: 400,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography 
        sx={{ 
          color: '#94a3b8',
          fontSize: '14px'
        }}
      >
        No Address Found
      </Typography>
    </Paper>
  </Box>
);
  
export default CustomerAddressList;