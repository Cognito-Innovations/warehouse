import React from 'react';
import { Box, Card, Typography, Chip, Link, Grid } from '@mui/material';
import { LocalPhoneOutlined, MailOutline, PersonOutline } from '@mui/icons-material';

interface Customer {
  name: string;
  email: string;
  suite_no?: string;
  phone?: string | null;
  alt_phone?: string | null;
}

interface StatusChipStyles {
  color: string;
  bgColor: string;
}

interface RequestHeaderProps {
  title: string;
  requestCode: string;
  statusDisplay: string;
  statusChipStyles: StatusChipStyles;
  customer: Customer;
  actionButtons?: React.ReactNode;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({
  title,
  requestCode,
  statusDisplay,
  statusChipStyles,
  customer,
  actionButtons,
}) => {
  return (
    <Card sx={{ p: 2, mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {title} #: {requestCode}
          </Typography>
          <Chip
            label={statusDisplay}
            size="small"
            sx={{
              ml: 2,
              color: statusChipStyles.color,
              bgcolor: statusChipStyles.bgColor,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          />
        </Box>
        {actionButtons && <Box>{actionButtons}</Box>}
      </Box>

      <Box>
        <Grid container alignItems="flex-start" rowSpacing={1} columnSpacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonOutline fontSize="small" color="action" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {customer.name}
                {customer.suite_no && `(${customer.suite_no})`}
              </Typography>
            </Box>

            {(customer.phone || customer.alt_phone) && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalPhoneOutlined fontSize="small" color="action" />
                <Box sx={{ ml: 1 }}>
                  {customer.phone && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", cursor: "default" }}
                    >
                      {customer.phone}
                    </Typography>
                  )}
                  {customer.phone && customer.alt_phone && (
                    <Typography variant="body2" sx={{ color: "text.primary" }}>,</Typography>
                  )}
                  {customer.alt_phone && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", cursor: "default" }}
                    >
                      {customer.alt_phone}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MailOutline fontSize="small" color="action" />
              <Link
                href={`mailto:${customer.email}`}
                variant="body2"
                sx={{
                  ml: 1,
                  wordBreak: "break-word",
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
                    textDecoration: "none",
                  },
                }}
              >
                {customer.email}
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default RequestHeader;