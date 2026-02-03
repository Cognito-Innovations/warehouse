import React, { useState } from 'react';
import {
  Card,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CommonTableBody from './CommonTableBody';
import { type ColumnDefinition } from '../../types/table';

interface CommonTableProps<T> {
  rows: T[];
  columns: ColumnDefinition<T>[];
  loading: boolean;
  statusOptions?: { value: string; label: string }[];
  noDataMessage: string;
  filtersComponent?: React.ReactNode;
  onViewDetails?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onToggle?: (id: string | number, newActive: boolean) => Promise<void>;
  isToggleLoading?: (id: string | number) => boolean;
  getIdentifier: (row: T) => string | number;
  getRowStatus: (row: T) => string;
}

const CommonTable = <T,>({
  rows,
  columns,
  loading,
  statusOptions,
  noDataMessage,
  filtersComponent,
  onViewDetails,
  onEdit,
  onDelete,
  onToggle,
  isToggleLoading,
  getIdentifier,
  getRowStatus,
}: CommonTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRows = statusFilter === 'All'
    ? rows
    : rows.filter((row) => getRowStatus(row) === statusFilter);

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const hasActions = Boolean(onViewDetails || onEdit || onDelete || onToggle);
  const actionCount = Number(!!onViewDetails) + Number(!!onEdit) + Number(!!onDelete) + Number(!!onToggle);
  const actionsWidth = actionCount === 0 ? '0px' : actionCount === 1 ? '60px' : actionCount === 2 ? '100px' : '140px';

  return (
    <>
      {(statusOptions?.length || filtersComponent) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          {statusOptions && statusOptions.length > 0 && (
            <>
              <IconButton>
                <FilterAltOutlinedIcon color="action" />
              </IconButton>
          
              <TextField
                select
                value={statusFilter}
                onChange={handleStatusChange}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="All">Status: All</MenuItem>
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          {filtersComponent}
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredRows.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            {noDataMessage}
          </Typography>
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell 
                      key={column.header}
                      align={column.align}
                      sx={{
                        py: 1.5,
                        px: 2,
                        fontWeight: 600,
                        width: column.width,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {column.header}
                    </TableCell>
                  ))}

                  {hasActions && (
                    <TableCell
                      align="center"
                      sx={{
                        py: 1.5,
                        px: 2,
                        fontWeight: 600,
                        width: actionsWidth
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <CommonTableBody
                rows={visibleRows}
                columns={columns}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
                isToggleLoading={isToggleLoading}
                getIdentifier={getIdentifier}
                getRowStatus={getRowStatus}
                hasActions={hasActions}
                actionsWidth={actionsWidth}
              />
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
    </>
  );
};

export default CommonTable;