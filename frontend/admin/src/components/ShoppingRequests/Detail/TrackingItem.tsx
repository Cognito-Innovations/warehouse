import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TrackingItem = ({ status, details, timestamp, completed, isLast }: any) => (
    <Box sx={{ display: 'flex', pb: isLast ? 0 : 2.5 }}>
        <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {completed
                ? <CheckCircleIcon sx={{ color: '#10B981' }} />
                : <RadioButtonUncheckedIcon sx={{ color: 'grey.400' }} />
            }
            {!isLast && <Box sx={{ width: '2px', flexGrow: 1, bgcolor: completed ? '#10B981' : '#E0E0E0', mt: 0.5 }} />}
        </Box>
        <Box sx={{ mt: '-4px' }}>
            <Typography variant="body2" fontWeight={500}>{status}</Typography>
            <Typography variant="caption" color="text.secondary" component="div">{details}</Typography>
            {timestamp && <Typography variant="caption" color="text.secondary">{timestamp}</Typography>}
        </Box>
    </Box>
);

export default TrackingItem;