import React from "react";
import { Box, Typography } from "@mui/material";
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

interface OrderCardMobileProps {
  order: OrderRow;
  onEdit?: (id: string | number) => void;
}

const OrderCardMobile: React.FC<OrderCardMobileProps> = ({ order, onEdit }) => {
  const itemsCount = parseInt(order.items_count || "0", 10);
  const totalAmount = Number(order.total_amount || "0");

  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        p: 2,
        mb: 2,
        bgcolor: "white",
        "&:hover": {
          boxShadow: 2,
        },
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* Order Number - Primary Info */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#6b7280",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: "0.05em",
            fontSize: "0.7rem",
            display: "block",
            mb: 0.5,
          }}
        >
          Order No.
        </Typography>
        <Typography variant="body1" fontWeight={600} color="text.primary">
          {order.order_number}
        </Typography>
      </Box>

      {/* Customer */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#6b7280",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: "0.05em",
            fontSize: "0.7rem",
            display: "block",
            mb: 0.5,
          }}
        >
          Customer
        </Typography>
        <Typography variant="body2" color="text.primary">
          {order.user_name}
        </Typography>
      </Box>

      {/* Items & Total - Side by Side */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
              fontSize: "0.7rem",
              display: "block",
              mb: 0.5,
            }}
          >
            Items
          </Typography>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {isNaN(itemsCount) ? 0 : itemsCount}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
              fontSize: "0.7rem",
              display: "block",
              mb: 0.5,
            }}
          >
            Total
          </Typography>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {isNaN(totalAmount) ? formatCurrency(0) : formatCurrency(totalAmount)}
          </Typography>
        </Box>
      </Box>

      {/* Payment Mode & Order Date */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
              fontSize: "0.7rem",
              display: "block",
              mb: 0.5,
            }}
          >
            Payment Mode
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.payment_mode || "Unknown"}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
              fontSize: "0.7rem",
              display: "block",
              mb: 0.5,
            }}
          >
            Order Date
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDateTime(order.created_at)}
          </Typography>
        </Box>
      </Box>

      {/* Status Chips */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", pt: 1.5, borderTop: "1px solid #f3f4f6" }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
              fontSize: "0.7rem",
              display: "block",
              mb: 0.5,
            }}
          >
            Payment
          </Typography>
          <StatusChip status={order.payment_status} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
              fontSize: "0.7rem",
              display: "block",
              mb: 0.5,
            }}
          >
            Status
          </Typography>
          <StatusChip status={order.status} />
        </Box>
      </Box>
    </Box>
  );
};

export default OrderCardMobile;

