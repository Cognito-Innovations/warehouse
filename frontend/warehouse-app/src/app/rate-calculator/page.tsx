import { Box, Typography } from '@mui/material';
import styles from '../page.module.css';

export default function RateCalculator() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, color: '#6b21a8' }}>
            Rate Calculator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calculate shipping rates and delivery costs for your packages.
          </Typography>
        </Box>
      </div>
    </div>
  );
}
