import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';

interface PaginationSectionProps {
  page: number;
  rowsPerPage: number;
  totalItems: number;
  filteredDataLength: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationSection: React.FC<PaginationSectionProps> = ({
  page,
  rowsPerPage,
  filteredDataLength,
  onPageChange
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
      <Typography variant="body2" color="text.secondary">
        Items per page: {rowsPerPage}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, filteredDataLength)} of {filteredDataLength}
        </Typography>
        <Pagination
          count={Math.ceil(filteredDataLength / rowsPerPage)}
          page={page}
          onChange={onPageChange}
          size="small"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default PaginationSection;
