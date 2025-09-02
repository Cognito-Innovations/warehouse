import { Paper, Stack, Typography, Button, Box } from '@mui/material';

const CustomerDocuments = () => (
  <Box>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" fontWeight={600} sx={{ fontSize: '18px', color: '#1e293b' }}>
        Photos / Documents
      </Typography>
      <Button 
        size="small" 
        variant="contained" 
        sx={{ 
          bgcolor: '#3b82f6', 
          '&:hover': { bgcolor: '#2563eb' },
          boxShadow: 'none', 
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 400,
          px: 2,
          py: 0.5
        }}
      >
        Upload
      </Button>
    </Stack>
    
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2.5, 
        borderRadius: 2,
        borderColor: '#e2e8f0',
        bgcolor: '#ffffff',
        height: 120
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box 
          sx={{ 
            width: 60,
            height: 45,
            bgcolor: '#f8f9fa',
            borderRadius: 1,
            border: '1px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Box
            component="img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1
            }}
            alt="ID document"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='45' viewBox='0 0 60 45'%3E%3Crect width='60' height='45' fill='%23f1f5f9'/%3E%3Ctext x='30' y='25' font-family='Arial' font-size='8' text-anchor='middle' fill='%2394a3b8'%3EID Card%3C/text%3E%3C/svg%3E"
          />
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 12,
              height: 12,
              bgcolor: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography sx={{ fontSize: '8px', color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
              ×
            </Typography>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            width: 60,
            height: 45,
            bgcolor: '#f8f9fa',
            borderRadius: 1,
            border: '1px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            component="img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1
            }}
            alt="Document"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='45' viewBox='0 0 60 45'%3E%3Crect width='60' height='45' fill='%23f1f5f9'/%3E%3Crect x='8' y='8' width='44' height='29' fill='white' stroke='%23e2e8f0'/%3E%3Cline x1='12' y1='15' x2='48' y2='15' stroke='%23cbd5e1'/%3E%3Cline x1='12' y1='19' x2='38' y2='19' stroke='%23cbd5e1'/%3E%3Cline x1='12' y1='23' x2='45' y2='23' stroke='%23cbd5e1'/%3E%3C/svg%3E"
          />
        </Box>
      </Stack>
    </Paper>
  </Box>
);

export default CustomerDocuments;