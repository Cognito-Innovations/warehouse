import { TableBody, TableCell, TableRow, IconButton, Stack } from '@mui/material';
import { VisibilityOutlined as ViewIcon } from '@mui/icons-material';
import { type ColumnDefinition } from '../../types/table';
import { EditIcon, Trash2 as DeleteIcon } from 'lucide-react';

interface CommonTableBodyProps<T> {
  rows: T[];
  columns: ColumnDefinition<T>[];
  onViewDetails?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  getIdentifier: (row: T) => string | number;
  hasActions?: boolean;
}

const CommonTableBody = <T,>({
  rows,
  columns,
  onViewDetails,
  onEdit,
  onDelete,
  getIdentifier,
  hasActions,
}: CommonTableBodyProps<T>) => {
  const hasEditDelete = Boolean(onEdit || onDelete);

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={String(getIdentifier(row))} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                width: '100px'
              }}
            >    
               <Stack direction="row" spacing={1} justifyContent="flex-end">
                {hasEditDelete ? (
                  <>
                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(getIdentifier(row))}
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
                        onClick={() => onDelete(getIdentifier(row))}
                        sx={{
                          color: '#6b7280',
                          '&:hover': { color: '#dc2626', backgroundColor: 'transparent' },
                        }}
                      >
                        <DeleteIcon size={18} strokeWidth={1.7} />
                      </IconButton>
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
                      onClick={() => onViewDetails(getIdentifier(row))}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  )
                )}
              </Stack>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default CommonTableBody;