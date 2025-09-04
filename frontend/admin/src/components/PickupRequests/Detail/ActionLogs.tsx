import { Box, Card, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ActionLogs = () => (
  <Card sx={{ p: 2, mt: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="h6" fontWeight={600}>
        Action Logs
      </Typography>
      <Button variant="contained" size="small" startIcon={<AddIcon />} sx={{textTransform: 'none'}}>
        Add
      </Button>
    </Box>
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="body2" color="text.secondary">
        No action logs found
      </Typography>
    </Box>
  </Card>
);

export default ActionLogs;