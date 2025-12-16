import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { getOrders } from "../services/api.services";
import TopNavbar from "../components/Layout/TopNavbar";
import CommonTable from "../components/common/CommonTable";
import StatusChip from "../components/common/StatusChip";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDateTime";
import type { ColumnDefinition } from "../types/table";
import EditOrderStatusModal from "../components/Orders/EditOrderStatusModal";
import ExportOrdersButton from "../components/Orders/ExportOrderButton";
import { ORDER_STATUS_OPTIONS } from "../utils/constants";

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

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns: ColumnDefinition<OrderRow>[] = [
    {
      header: "Order No.",
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.order_number}</Typography>,
      width: "15%",
    },
    {
      header: "Customer",
      cell: (row) => <Typography variant="body2">{row.user_name}</Typography>,
      width: "13%",
    },
    {
      header: "Items",
      cell: (row) => {
        const count = parseInt(row.items_count || '0', 10);
        return <Typography variant="body2">{isNaN(count) ? 0 : count}</Typography>;
      },
      width: "8%",
    },
    {
      header: "Total",
      cell: (row) => {
        const amount = Number(row.total_amount || '0');
        return <Typography variant="body2">{isNaN(amount) ? formatCurrency(0) : formatCurrency(amount)}</Typography>;
      },
      width: "12%",
    },
    {
      header: "Payment Mode",
      cell: (row) => <Typography variant="body2">{row.payment_mode || 'Unknown'}</Typography>,
      width: "12%",
    },
    {
      header: "Order Date",
      cell: (row) => <Typography variant="body2">{formatDateTime(row.created_at)}</Typography>,
      width: "12%",
    },
    {
      header: "Payment",
      cell: (row) => <StatusChip status={row.payment_status} />,
      width: "10%",
    },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
      width: "12%",
    },
  ];

  const handleEditStatus = useCallback((id: string | number) => {
    const idStr = typeof id === 'string' ? id : id.toString();
    const row = orders.find((r) => r.id === idStr);
    if (row) {
      setSelectedOrder(row);
    }
  }, [orders]);

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  return (
    <Box>
      <TopNavbar pageTitle="Orders" />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, my: 2 }}>
        <ExportOrdersButton orders={orders} />
      </Box>

      <CommonTable
        rows={orders}
        columns={columns}
        loading={loading}
        statusOptions={ORDER_STATUS_OPTIONS}
        noDataMessage="No orders available"
        onEdit={handleEditStatus}
        getIdentifier={(row) => row.id}
        getRowStatus={(row) => row.status}
      />

      <EditOrderStatusModal
        open={!!selectedOrder}
        onClose={handleCloseModal}
        orderId={selectedOrder?.id || ''}
        orderNumber={selectedOrder?.order_number || ''}
        currentStatus={selectedOrder?.status || ''}
        statusOptions={ORDER_STATUS_OPTIONS}
        onOrderUpdated={fetchOrders}
      />
    </Box>
  );
};

export default Orders;
