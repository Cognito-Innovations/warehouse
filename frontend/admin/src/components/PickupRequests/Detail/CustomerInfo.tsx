import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string[];
}

interface CustomerInfoProps {
  user: User;
  userId: [];
}

const InfoItem: React.FC<{ icon: React.ReactElement; text: string }> = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
    {React.cloneElement(icon, { sx: { fontSize: '1.25rem', color: 'text.secondary' } })}
    <Typography variant="body2" color="text.secondary" noWrap>
      {text}
    </Typography>
  </Box>
);

const CustomerInfo: React.FC<CustomerInfoProps> = ({ user, userId }) => {
  const phoneString = user.phone_number?.join(', ');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>
      <InfoItem
        icon={<PersonOutlineIcon />}
        text={`${user.name} (${userId.id})`}
      />
      <InfoItem
        icon={<MailOutlineIcon />}
        text={user.email}
      />
      {phoneString && (
        <InfoItem
          icon={<LocalPhoneIcon />}
          text={phoneString}
        />
      )}
    </Box>
  );
};  

export default CustomerInfo;