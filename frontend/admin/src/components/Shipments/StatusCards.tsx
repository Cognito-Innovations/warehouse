import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid
} from '@mui/material';
import { statusCards } from '../../data/shipments';

interface StatusCardsProps {
  onSelectStatus: (status: string) => void;
}

const StatusCards: React.FC<StatusCardsProps> = ({ onSelectStatus }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {statusCards.map((card, index) => ( 
        <Grid spacing={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card
            onClick={() => onSelectStatus(card.statusValue)}
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              width: 200,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
            }}
          >
            <CardContent sx={{ p: 2.5, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'text.secondary', mb: 0.5 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, fontSize: '1.8rem', color: 'text.primary' }}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                    flexShrink: 0,
                    marginTop: 2
                  }}
                >
                  <card.icon sx={{ fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatusCards;