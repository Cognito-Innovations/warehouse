import { Box, Card, Typography, Divider } from '@mui/material';
import { LocalPhoneOutlined, MailOutline } from '@mui/icons-material';

const CustomerInfo = ({ details }) => {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600}>
        {details.users.name} ({details.user_id})
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
        <MailOutline fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>{details.users.email}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LocalPhoneOutlined fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>{details.users.phone}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Customer Remarks
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {details.remarks}
      </Typography>
    </Card>
  );
};

export default CustomerInfo;