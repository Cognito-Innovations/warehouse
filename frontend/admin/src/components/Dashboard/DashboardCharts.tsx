import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

type ChartSeries = {
  data: number[];
  label: string;
  color?: string;
  area?: boolean;
};

type GridSize = { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };

type ChartConfig = {
  title: string;
  subtitle?: string;
  xLabels: string[];
  series: ChartSeries[];
  gridSize?: GridSize;
};

interface DashboardChartsProps {
  charts: ChartConfig[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ charts }) => {
  return (
    <Grid container spacing={3}>
      {charts.map((chart, idx) => (
        <Grid key={idx} size={chart.gridSize ?? { xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {chart.title}
                </Typography>
                {chart.subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {chart.subtitle}
                  </Typography>
                )}
              </Box>
              <Box sx={{ height: 300 }}>
                <LineChart
                  xAxis={[{
                    data: chart.xLabels,
                    scaleType: 'point',
                  }]}
                  series={chart.series}
                  width={undefined}
                  height={300}
                  margin={{ left: 50, right: 50, top: 50, bottom: 50 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export type { ChartConfig, ChartSeries };
export default DashboardCharts;