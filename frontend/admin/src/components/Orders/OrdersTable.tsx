import React from "react";
import {
  Card,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import OrderCardMobile from "./OrderCardMobile";
import OrderTableRow from "./OrderTableRow";
import { type ColumnDefinition } from "../../types/table";

interface OrderRow {
  id: string;
  order_number: string;
  user_name: string;
  cashfree_payment_id: string;
  items_count: string;
  total_amount: string;
  payment_mode: string;
  created_at: string;
  status: string;
  payment_status: string;
}

interface OrdersTableProps {
  rows: OrderRow[];
  columns: ColumnDefinition<OrderRow>[];
  loading: boolean;
  statusOptions?: { value: string; label: string }[];
  noDataMessage: string;
  // onEdit?: (id: string | number) => void;
  getIdentifier: (row: OrderRow) => string | number;
  getRowStatus: (row: OrderRow) => string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  rows,
  columns,
  loading,
  statusOptions,
  noDataMessage,
  // onEdit,
  getIdentifier,
  getRowStatus,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [statusFilter, setStatusFilter] = React.useState("All");

  const filteredRows =
    statusFilter === "All"
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (filteredRows.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          {noDataMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {statusOptions && statusOptions.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
            {statusOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {/* Mobile Card View */}
      {isMobile ? (
        <Box sx={{ px: 2 }}>
          {visibleRows.map((row) => (
            <OrderCardMobile
              key={String(getIdentifier(row))}
              order={row}
              // onEdit={onEdit}
            />
          ))}
          <TablePagination
            rowsPerPageOptions={[15, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      ) : (
        /* Desktop Table View */
        <Card
          sx={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead 
                sx={{ 
                  bgcolor: "#f8fafc",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.header}
                      align={column.align || "left"}
                      sx={{
                        py: 2,
                        px: 3,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#6b7280",
                        width: column.width,
                        whiteSpace: "nowrap",
                        borderBottom: "none",
                      }}
                    >
                      {column.header}
                    </TableCell>
                  ))}
                  {/* TODO: Uncomment Actions column when order edit functionality is enabled */}
                  {/* {onEdit && (
                    <TableCell
                      align="center"
                      sx={{
                        py: 2,
                        px: 3,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#6b7280",
                        width: "60px",
                        borderBottom: "none",
                      }}
                    >
                      Actions
                    </TableCell>
                  )} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row) => (
                  <OrderTableRow
                    key={String(getIdentifier(row))}
                    order={row}
                    // onEdit={onEdit}
                  />
                ))}
              </TableBody>
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
            sx={{
              borderTop: "1px solid #e5e7eb",
              "& .MuiTablePagination-toolbar": {
                px: 3,
                py: 1.5,
              },
              "& .MuiTablePagination-selectLabel": {
                fontSize: "0.875rem",
                color: "#6b7280",
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: "0.875rem",
                color: "#374151",
                fontWeight: 500,
              },
            }}
          />
        </Card>
      )}
    </>
  );
};

export default OrdersTable;

