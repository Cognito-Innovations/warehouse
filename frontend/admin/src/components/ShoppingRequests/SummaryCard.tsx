import { Avatar, Box, Card, Typography } from "@mui/material";

export const SummaryCard = ({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ReactElement;
  bgColor: string;
}) => (
  <Card
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 2.5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <Box sx={{ flex: 1 }}>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 0.5,
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '0.025em'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          fontSize: '2rem',
          lineHeight: 1.2,
          color: 'text.primary'
        }}
      >
        {value}
      </Typography>
    </Box>
    <Avatar
      sx={{
        width: 48,
        height: 48,
        bgcolor: bgColor,
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        '& .MuiSvgIcon-root': {
          fontSize: '1.5rem',
        },
      }}
    >
      {icon}
    </Avatar>
  </Card>
);