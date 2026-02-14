import { Box, Button, Card, Typography } from '@mui/material';
import { useShipmentDetail } from '../../../contexts/ShipmentDetailContext';

const ActionLogs = () => {
  const { isDiscarded } = useShipmentDetail();

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
        > 
          Action Logs 
        </Typography>

        <Button
          variant="contained"
          size="small"
          disabled={isDiscarded}
          sx={{
            textTransform: 'none',
            bgcolor: isDiscarded ? '#cbd5e1' : undefined,
            color: isDiscarded ? '#64748b' : undefined,
            cursor: isDiscarded ? 'not-allowed' : 'pointer',
            opacity: isDiscarded ? 0.7 : 1,
          }}
        >
          Add
        </Button>
      </Box>

      <Card sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No action logs found
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ActionLogs;
