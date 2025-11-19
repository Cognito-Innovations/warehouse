import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import StatusChip from "../common/StatusChip";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatCurrency } from "../../utils/formatCurrency";
import type { OrderDetails, OrderItem } from "../../types/order";

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: OrderDetails | null;
  loading: boolean;
  onUpdateStatus: () => void;
}

// Component for the grey info boxes
const InfoBox: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Paper variant="outlined" sx={{ bgcolor: "grey.50", p: 2, border: 'none' }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {children}
  </Paper>
);

// For label/value pairs
const InfoPair: React.FC<{ label: string; value: string | React.ReactNode }> = ({
  label,
  value,
}) => (
  <Box mb={1}>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
  loading,
  onUpdateStatus,
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!order) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <Typography>No order details found.</Typography>
        </Box>
      );
    }

    return (
      <Box
        display="flex"
        flexWrap="wrap"
        sx={{ margin: (theme) => theme.spacing(-1) }}
      >
        {/* Row 1: Status and Dates */}
        <Box
          sx={{
            padding: (theme) => theme.spacing(1),
            width: { xs: "100%", md: "33.33%" },
          }}
        >
          <InfoPair label="Status" value={<StatusChip status={order.status} />} />
        </Box>
        <Box
          sx={{
            padding: (theme) => theme.spacing(1),
            width: { xs: "100%", md: "33.33%" },
          }}
        >
          <InfoPair label="Order Date" value={formatDateTime(order.order_date)} />
        </Box>
        <Box
          sx={{
            padding: (theme) => theme.spacing(1),
            width: { xs: "100%", md: "33.33%" },
          }}
        >
          <InfoPair label="Delivery Date" value={formatDateTime(order.delivery_date!)} />
        </Box>

        {/* Row 2: Customer Information */}
        <Box
          sx={{
            padding: (theme) => theme.spacing(1),
            width: { xs: "100%", md: "58.33%" },
          }}
        >
          <InfoBox title="Customer Information">
            <Box
              display="flex"
              flexWrap="wrap"
              sx={{ margin: (theme) => theme.spacing(-1) }}
            >
              <Box
                sx={{
                  padding: (theme) => theme.spacing(1),
                  width: { xs: "100%", sm: "50%" },
                }}
              >
                <InfoPair label="Name" value={order.customer_info.name} />
              </Box>
              <Box
                sx={{
                  padding: (theme) => theme.spacing(1),
                  width: { xs: "100%", sm: "50%" },
                }}
              >
                <InfoPair label="Email" value={order.customer_info.email} />
              </Box>
              <Box
                sx={{
                  padding: (theme) => theme.spacing(1),
                  width: { xs: "100%", sm: "50%" },
                }}
              >
                <InfoPair label="Phone" value={order.customer_info.phone} />
              </Box>
              <Box
                sx={{
                  padding: (theme) => theme.spacing(1),
                  width: "100%",
                }}
              >
                <InfoPair label="Shipping Address" value={order.customer_info.shipping_address} />
              </Box>
            </Box>
          </InfoBox>
        </Box>

        {/* Row 3 & 5: Payment & Summary */}
        <Box
          sx={{
            padding: (theme) => theme.spacing(1),
            width: { xs: "100%", md: "41.67%" },
          }}
        >
          <Box
            display="flex"
            flexWrap="wrap"
            sx={{ margin: (theme) => theme.spacing(-1) }}
          >
            {/* Row 3: Payment */}
            <Box
              sx={{
                padding: (theme) => theme.spacing(1),
                width: "100%",
              }}
            >
              <InfoBox title="Payment Information">
                <Box
                  display="flex"
                  flexWrap="wrap"
                  sx={{ margin: (theme) => theme.spacing(-1) }}
                >
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(1),
                      width: "50%",
                    }}
                  >
                    <InfoPair label="Payment ID" value={order.payment_info.id} />
                  </Box>
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(1),
                      width: "50%",
                    }}
                  >
                    <InfoPair label="Payment Method" value={order.payment_info.method} />
                  </Box>
                </Box>
              </InfoBox>
            </Box>

            {/* Row 5: Order Summary */}
            <Box
              sx={{
                padding: (theme) => theme.spacing(1),
                width: "100%",
              }}
            >
              <InfoBox title="Order Summary">
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatCurrency(order.summary.subtotal)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">Discount</Typography>
                  <Typography variant="body1" fontWeight={500} color="error.main">
                    -{formatCurrency(order.summary.discount)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">Tax</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatCurrency(order.summary.tax)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(order.summary.total)}
                  </Typography>
                </Box>
              </InfoBox>
            </Box>
          </Box>
        </Box>

        {/* Row 4: Order Items Table */}
        <Box
          sx={{
            padding: (theme) => theme.spacing(1),
            width: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item: OrderItem) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.product_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.product_category}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell align="right">
                      {item.discount_percent}%
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order?.id || ""}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={onUpdateStatus} variant="contained">
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;