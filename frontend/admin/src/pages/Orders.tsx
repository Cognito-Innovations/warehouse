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
import EditOrderStatusModal, { type StatusOption } from "../components/Orders/EditOrderStatusModal";
import ExportOrdersButton from "../components/Orders/ExportOrderButton";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  payment_id: string;
  item_count: number;
  total: number;
  payment_method: string;
  order_date: string;
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

  const statusOptions: StatusOption[] = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REFUNDED', label: 'Refunded' },
  ];

  const columns: ColumnDefinition<OrderRow>[] = [
    {
      header: "Order No.",
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.order_number}</Typography>,
      width: "18%",
    },
    {
      header: "Customer",
      cell: (row) => <Typography variant="body2">{row.customer_name}</Typography>,
      width: "15%",
    },
    {
      header: "Items",
      cell: (row) => <Typography variant="body2">{row.item_count}</Typography>,
      width: "8%",
    },
    {
      header: "Total",
      cell: (row) => <Typography variant="body2">{formatCurrency(row.total)}</Typography>,
      width: "12%",
    },
    {
      header: "Payment Method",
      cell: (row) => <Typography variant="body2">{row.payment_method}</Typography>,
      width: "12%",
    },
    {
      header: "Order Date",
      cell: (row) => <Typography variant="body2">{formatDateTime(row.order_date)}</Typography>,
      width: "15%",
    },
    {
      header: "Payment",
      cell: (row) => <StatusChip status={row.payment_status} />,
      width: "10%",
    },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
      width: "10%",
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
        statusOptions={statusOptions}
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
        statusOptions={statusOptions}
        onOrderUpdated={fetchOrders}
      />
    </Box>
  );
};

export default Orders;
