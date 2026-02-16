import { TableBody, TableCell, TableRow, IconButton, Stack, Tooltip, Switch, CircularProgress } from '@mui/material';
import { VisibilityOutlined as ViewIcon } from '@mui/icons-material';
import { type ColumnDefinition } from '../../types/table';
import { EditIcon, Trash2 as DeleteIcon } from 'lucide-react';

interface CommonTableBodyProps<T> {
  rows: T[];
  columns: ColumnDefinition<T>[];
  onViewDetails?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onToggle?: (id: string | number, newActive: boolean) => Promise<void>;
  isToggleLoading?: (id: string | number) => boolean;
  getIdentifier: (row: T) => string | number;
  getRowStatus: (row: T) => string;
  hasActions?: boolean;
  actionsWidth?: string;
}

const CommonTableBody = <T,>({
  rows,
  columns,
  onViewDetails,
  onEdit,
  onDelete,
  onToggle,
  isToggleLoading,
  getIdentifier,
  getRowStatus,
  hasActions,
  actionsWidth = '150px',
}: CommonTableBodyProps<T>) => {
  const hasEditDelete = Boolean(onEdit || onDelete);

  return (
    <TableBody>
      {rows.map((row) => {
        const rowId = getIdentifier(row);
        const isLoading = isToggleLoading ? isToggleLoading(rowId) : false;
        const isActive = getRowStatus(row) === 'Active';
        return (
          <TableRow key={String(rowId)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {columns.map((column, index) => (
              <TableCell 
                key={index}
                align={column.align || 'left'}
                sx={{
                  py: 1.5,
                  px: 2,
                  width: column.width,
                }}
              >
                {column.cell(row)}
              </TableCell>
            ))}

            {hasActions && (
              <TableCell
                align="right"
                sx={{
                  py: 1.5,
                  px: 2,
                  width: actionsWidth
                }}
              >    
                 <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {hasEditDelete ? (
                    <>
                      {onEdit && (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(rowId)}
                          sx={{
                            color: '#6b7280',
                            '&:hover': { color: '#111827', backgroundColor: 'transparent' },
                          }}
                        >
                          <EditIcon size={18} strokeWidth={1.7} />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(rowId)}
                          aria-label="delete"
                          sx={{
                            color: '#6b7280',
                            '&:hover': { color: '#dc2626', backgroundColor: 'transparent' },
                          }}
                        >
                          <DeleteIcon size={18} strokeWidth={1.7} />
                        </IconButton>
                      )}
                      {onToggle && (
                        <Tooltip title={isActive ? 'Product is active' : 'Product is inactive'}>
                          {isLoading ? (
                            <CircularProgress size={20} color="primary" />
                          ) : (
                            <Switch
                              checked={isActive}
                              onChange={(e) => onToggle(rowId, e.target.checked)}
                              size="small"
                              color="primary"
                              sx={{
                                '& .MuiSwitch-switchBase': {
                                  color: '#6b7280',
                                },
                                '& .MuiSwitch-track': {
                                  backgroundColor: '#d1d5db',
                                },
                                '& .MuiSwitch-primary.Mui-checked': {
                                  '& .MuiSwitch-switchBase': {
                                    color: '#10b981',
                                  },
                                  '& .MuiSwitch-track': {
                                    backgroundColor: '#10b981',
                                  },
                                },
                              }}
                            />
                          )}
                        </Tooltip>
                      )}
                    </>
                  ) : (
                    onViewDetails && (
                      <IconButton
                        size="small"
                        sx={{
                          color: '#6b7280',
                          '&:hover': { color: '#111827', backgroundColor: 'transparent' },
                        }}
                        onClick={() => onViewDetails(rowId)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    )
                  )}
                </Stack>
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default CommonTableBody;