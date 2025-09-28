import { TableBody, TableCell, TableRow, IconButton } from '@mui/material';
import { VisibilityOutlined as ViewIcon } from '@mui/icons-material';
import { type ColumnDefinition } from '../../types/table';

interface CommonTableBodyProps<T> {
  rows: T[];
  columns: ColumnDefinition<T>[];
  onViewDetails: (id: string | number) => void;
  getIdentifier: (row: T) => string | number;
}

const CommonTableBody = <T,>({ rows, columns, onViewDetails, getIdentifier }: CommonTableBodyProps<T>) => {
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
          <TableCell
            align="right"
            sx={{
              py: 1.5,
              px: 2,
              width: '100px'
            }}
          >    
            <IconButton
              size="small"
              sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' } }}
              onClick={() => onViewDetails(getIdentifier(row))}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default CommonTableBody;