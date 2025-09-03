import { Box, Typography, Paper, Stack } from '@mui/material';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import BackpackIcon from '@mui/icons-material/Backpack';

const CustomerStats = () => (
  <Stack spacing={3}>
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        sx={{ fontSize: '18px', color: '#1e293b' }}
      >
        Package
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          borderColor: '#e2e8f0',
          bgcolor: '#ffffff',
          width: 200,
          height: 140,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          height="100%"
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: '13px', color: '#94a3b8', mb: 0.5 }}
            >
              Total
            </Typography>
            <Typography
              variant="h2"
              fontWeight={600}
              sx={{
                fontSize: '36px',
                color: '#0f172a',
                lineHeight: 1,
                mt: 3,
              }}
            >
              0
            </Typography>
          </Box>
          <AllInboxIcon sx={{ fontSize: 40, color: '#ec4899', mt: 5 }} />
        </Stack>
      </Paper>
    </Box>

    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        sx={{ fontSize: '18px', color: '#1e293b' }}
      >
        Shipment
      </Typography>
      <Stack direction="row" spacing={2}>
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 2,
            borderColor: '#e2e8f0',
            bgcolor: '#ffffff',
            width: 200,
            height: 140,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            height="100%"
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: '13px', color: '#94a3b8', mb: 0.5 }}
              >
                Total
              </Typography>
              <Typography
                variant="h2"
                fontWeight={600}
                sx={{
                  fontSize: '36px',
                  color: '#0f172a',
                  lineHeight: 1,
                  mt: 3,
                }}
              >
                0
              </Typography>
            </Box>
            <BackpackIcon sx={{ fontSize: 40, color: '#ef4444', mt: 5 }} />
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 2,
            borderColor: '#e2e8f0',
            bgcolor: '#ffffff',
            width: 200,
            height: 140,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            height="100%"
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: '13px', color: '#94a3b8', mb: 0.5 }}
              >
                Total Weight
              </Typography>
              <Typography
                variant="h2"
                fontWeight={600}
                sx={{
                  fontSize: '36px',
                  color: '#0f172a',
                  lineHeight: 1,
                  mt: 3,
                }}
              >
                0
              </Typography>
            </Box>
            <BackpackIcon sx={{ fontSize: 40, color: '#ef4444', mt: 5 }} />
          </Stack>
        </Paper>
      </Stack>
    </Box>
  </Stack>
);

export default CustomerStats;