import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Warning as WarningIcon,
  LocalShipping as ShippingIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface StatusCard {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  icon: string;
  status: string;
}

interface StatusCardsProps {
  onRegisterPackage: () => void;
  statusCards: StatusCard[];
  selectedStatus: string | null;
  onStatusClick: (status: string | null) => void;
  loading?: boolean;
}

const StatusCards: React.FC<StatusCardsProps> = ({ 
  onRegisterPackage, 
  statusCards, 
  selectedStatus, 
  onStatusClick, 
  loading = false 
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'InfoIcon':
        return <InfoIcon />;
      case 'WarningIcon':
        return <WarningIcon />;
      case 'ShippingIcon':
        return <ShippingIcon />;
      case 'CheckCircleIcon':
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3, width: '100%', maxWidth: '100%' }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#6366f1',
            height: 120,
            width: '100%',
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
          onClick={onRegisterPackage}
        >
          Register Package
        </Button>
      </Grid>
      
      {statusCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card 
            sx={{ 
              height: 120,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              border: selectedStatus === card.status ? `2px solid ${card.color}` : '2px solid transparent',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              }
            }}
            onClick={() => onStatusClick(selectedStatus === card.status ? null : card.status)}
          >
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    bgcolor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  {getIcon(card.icon)}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color }}>
                  {loading ? '...' : card.value}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

    </Grid>
  );
};

export default StatusCards;
