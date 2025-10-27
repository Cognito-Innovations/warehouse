import { Box, Button, Card, Typography } from '@mui/material';

const ActionLogs = () => (
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
              sx={{ textTransform: 'none' }}
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

export default ActionLogs;
