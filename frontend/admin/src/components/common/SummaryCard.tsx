import React from 'react';
import { Box, Card, Typography } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  bgColor: string;
  onClick: () => void;
  isSelected: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, bgColor, onClick, isSelected }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: isSelected ? `2px solid ${bgColor}` : '2px solid transparent',
        boxShadow: isSelected ? `0 4px 20px 0 rgba(0,0,0,0.12), 0 7px 8px -5px ${bgColor}60` : 3,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px 0 rgba(0,0,0,0.12), 0 7px 8px -5px ${bgColor}60`,
        }
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
      </Box>
      <Box sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        color: '#fff'
      }}>
        {icon}
      </Box>
    </Card>
  );
};