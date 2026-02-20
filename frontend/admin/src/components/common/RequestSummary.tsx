import React, { useMemo } from 'react';
import { Box, Card, Skeleton } from '@mui/material';
import { SummaryCard } from './SummaryCard';

export interface SummaryCardConfig {
  title: string;
  status: string | string[];
  icon: React.ReactElement;
  bgColor: string;
}

export interface Request {
  status: string;
}

interface RequestSummaryProps {
  requests: Request[];
  loading: boolean;
  summaryConfig: SummaryCardConfig[];
  onCardClick: (status: string | string[] | null) => void;
  selectedStatus: string | string[] | null;
}

const RequestSummary: React.FC<RequestSummaryProps> = ({
  requests,
  loading,
  summaryConfig,
  onCardClick,
  selectedStatus,
}) => {
  const summaryCounts = useMemo(() => {
    if (!requests) return {};

    const counts: { [key: string]: number } = {};
    summaryConfig.forEach(config => {
      const statuses = Array.isArray(config.status) ? config.status : [config.status];
      counts[config.title] = requests.filter(req => statuses.includes(req.status)).length;
    });
    return counts;
  }, [requests, summaryConfig]);

  const handleCardClick = (status: string | string[]) => {
    const isSelected = JSON.stringify(selectedStatus) === JSON.stringify(status);
    onCardClick(isSelected ? null : status);
  };

  if (loading) {
    return (
      <Box sx={{ mb: 4 }} data-testid="request-summary-loading">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${summaryConfig.length}, 1fr)` }, gap: 2.5 }}>
          {[...Array(summaryConfig.length)].map((_, index) => (
            <Card key={index} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2.5 }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="30%" height={40} />
              </Box>
              <Skeleton variant="circular" width={48} height={48} />
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: `repeat(${summaryConfig.length}, 1fr)`},
          gap: 2.5,
        }}
      >
        {summaryConfig.map((config) => (
          <SummaryCard
            key={config.title}
            title={config.title}
            value={String(summaryCounts[config.title] || 0)}
            icon={config.icon}
            bgColor={config.bgColor}
            onClick={() => handleCardClick(config.status)}
            isSelected={JSON.stringify(selectedStatus) === JSON.stringify(config.status)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RequestSummary;