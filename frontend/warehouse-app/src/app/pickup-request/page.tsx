import { Box, Typography } from '@mui/material';
import styles from '../page.module.css';

export default function PickupRequest() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, color: '#6b21a8' }}>
            Pickup Request
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Schedule a pickup for your packages and shipments.
          </Typography>
        </Box>
      </div>
    </div>
  );
}
