import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { getOrderByOrderId, getOrders } from "../services/api.services";
import TopNavbar from "../components/Layout/TopNavbar";
import CommonTable from "../components/common/CommonTable";
import StatusChip from "../components/common/StatusChip";
import OrderDetailsModal from "../components/Orders/OrderDetailsModal";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDateTime";
import type { OrderDetails } from "../types/order";
import type { ColumnDefinition } from "../types/table";

interface OrderRow {
  id: string;
  customer_name: string,
  payment_id: string,
  item_count: number,
  total: number,
  payment_method: string,
  order_date: string,
  status: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      const mappedData: OrderRow[] = response.map((item: any) => ({
        id: item.id,
        customer_name: item.customer_name,
        payment_id: item.payment_id,
        item_count: item.item_count,
        total: item.total,
        payment_method: item.payment_method,
        order_date: item.order_date,
        status: item.status,
      }));
      setOrders(mappedData);
    } catch (error) {
      console.error("Error fetching sub categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const columns: ColumnDefinition<OrderRow>[] = [
    {
      header: "Order ID",
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.id}</Typography>,
      width: "25%",
    },
    {
      header: "Customer",
      cell: (row) => <Typography variant="body2">{row.customer_name}</Typography>,
      width: "25%",
    },
    {
      header: "Payment ID",
      cell: (row) => <Typography variant="body2">{row.payment_id}</Typography>,
      width: "15%",
    },
    {
      header: "Items",
      cell: (row) => <Typography variant="body2">{row.item_count}</Typography>,
      width: "15%",
    },
    {
      header: "Total",
      cell: (row) => <Typography variant="body2">{formatCurrency(row.total)}</Typography>,
      width: "15%",
    },
    {
      header: "Payment Method",
      cell: (row) => <Typography variant="body2">{row.payment_method}</Typography>,
      width: "20%",
    },
    {
      header: "Order Date",
      cell: (row) => <Typography variant="body2">{formatDateTime(row.order_date)}</Typography>,
      width: "20%",
    },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
      width: "15%",
    },
  ];

  const handleViewDetails = useCallback(async (id: string | number) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const details = await getOrderByOrderId(id);
      setSelectedOrder(details);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSelectedOrder(null);
    } finally {
      setIsModalLoading(false);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = () => {
    console.log("Update Status clicked for:", selectedOrder?.id);
    handleCloseModal();
  };

  return (
    <Box>
      <TopNavbar pageTitle="Orders" />

      <CommonTable
        rows={orders}
        columns={columns}
        loading={loading}
        statusOptions={statusOptions}
        noDataMessage="No orders available"
        onViewDetails={handleViewDetails}
        getIdentifier={(row) => row.id}
        getRowStatus={(row) => row.status}
      />

      <OrderDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        loading={isModalLoading}
        onUpdateStatus={handleUpdateStatus}
      />
    </Box>
  );
};

export default Orders;
