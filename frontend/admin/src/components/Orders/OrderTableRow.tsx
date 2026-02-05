import React from "react";
import { TableCell, TableRow, Typography,
  // IconButton,
  Box, Chip } from "@mui/material";
// import { EditIcon } from "lucide-react";
import StatusChip from "../common/StatusChip";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";

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

interface OrderTableRowProps {
  order: OrderRow;
  // onEdit?: (id: string | number) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({ order, 
  // onEdit
}) => {
  const itemsCount = parseInt(order.items_count || "0", 10);
  const totalAmount = Number(order.total_amount || "0");

  return (
    <TableRow
      sx={{
        borderBottom: "1px solid #f3f4f6",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: "#f9fafb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        },
        "&:last-child td": {
          borderBottom: 0,
        },
      }}
    >
      {/* Order Number */}
      <TableCell
        sx={{
          py: 2.5,
          px: 3,
          width: "15%",
        }}
      >
        <Typography 
          variant="body2" 
          fontWeight={600}
          sx={{
            color: "#111827",
            fontFamily: "monospace",
            fontSize: "0.875rem",
          }}
        >
          {order.order_number}
        </Typography>
      </TableCell>

      {/* Customer */}
      <TableCell
        sx={{
          py: 2.5,
          px: 3,
          width: "13%",
        }}
      >
        <Typography 
          variant="body2" 
          sx={{
            color: "#374151",
            fontWeight: 500,
          }}
        >
          {order.user_name}
        </Typography>
      </TableCell>

      {/* Items Count */}
      <TableCell
        align="center"
        sx={{
          py: 2.5,
          px: 3,
          width: "8%",
        }}
      >
        <Chip
          label={isNaN(itemsCount) ? 0 : itemsCount}
          size="small"
          sx={{
            bgcolor: "#eff6ff",
            color: "#1e40af",
            fontWeight: 600,
            fontSize: "0.75rem",
            height: "24px",
            minWidth: "40px",
          }}
        />
      </TableCell>

      {/* Total Amount */}
      <TableCell
        sx={{
          py: 2.5,
          px: 3,
          width: "12%",
        }}
      >
        <Typography 
          variant="body2" 
          fontWeight={700}
          sx={{
            color: "#059669",
            fontSize: "0.9375rem",
          }}
        >
          {isNaN(totalAmount) ? formatCurrency(0) : formatCurrency(totalAmount)}
        </Typography>
      </TableCell>

      {/* Payment Mode */}
      <TableCell
        sx={{
          py: 2.5,
          px: 3,
          width: "12%",
        }}
      >
        <Typography 
          variant="body2"
          sx={{
            color: "#6b7280",
            textTransform: "capitalize",
          }}
        >
          {order.payment_mode || "Unknown"}
        </Typography>
      </TableCell>

      {/* Order Date */}
      <TableCell
        sx={{
          py: 2.5,
          px: 3,
          width: "12%",
        }}
      >
        <Typography 
          variant="body2"
          sx={{
            color: "#6b7280",
            fontSize: "0.8125rem",
          }}
        >
          {formatDateTime(order.created_at)}
        </Typography>
      </TableCell>

      {/* Payment Status */}
      {/* <TableCell
        align="center"
        sx={{
          py: 2.5,
          px: 3,
          width: "10%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <StatusChip status={order.payment_status} />
        </Box>
      </TableCell> */}

      {/* Order Status */}
      <TableCell
        align="center"
        sx={{
          py: 2.5,
          px: 3,
          width: "12%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <StatusChip status={order.status} />
        </Box>
      </TableCell>

      {/* TODO: Uncomment Actions column when order edit functionality is enabled */}
      {/* Actions */}
      {/* {onEdit && (
        <TableCell
          align="right"
          sx={{
            py: 2.5,
            px: 3,
            width: "60px",
          }}
        >
          <IconButton
            size="small"
            onClick={() => onEdit(order.id)}
            sx={{
              color: "#6b7280",
              transition: "all 0.2s ease-in-out",
              "&:hover": { 
                color: "#6366f1", 
                bgcolor: "#eef2ff",
                transform: "scale(1.1)",
              },
            }}
          >
            <EditIcon size={18} strokeWidth={1.7} />
          </IconButton>
        </TableCell>
      )} */}
    </TableRow>
  );
};

export default OrderTableRow;

