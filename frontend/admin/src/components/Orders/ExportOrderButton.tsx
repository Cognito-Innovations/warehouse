import React from 'react';
import { AssessmentOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
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

interface ExportOrdersButtonProps {
  orders: OrderRow[];
}

const ExportOrdersButton: React.FC<ExportOrdersButtonProps> = ({ orders }) => {

  const handleExport = () => {
    if (!orders || orders.length === 0) {
      toast.error("No orders available to export.");
      return;
    }

    const data = orders.map((order) => {
      const itemCount = parseInt(order.items_count || '0', 10);
      const total = Number(order.total_amount || '0');
      const timestampMs = Number(order.created_at || '0') * 1000;
      return {
        "Order Number": order.order_number,
        "Customer Name": order.user_name,
        "Item Count": isNaN(itemCount) ? 0 : itemCount,
        "Total": isNaN(total) ? 0 : total,
        "Payment Method": order.payment_mode || 'Unknown',
        "Order Date": order.created_at ? formatDateTime(timestampMs) : '-',
        "Status": order.status,
        "Payment Status": order.payment_status,
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Generate file name with today's date
    const today = new Date().toISOString().split('T')[0];
    const fileName = `orders-report-${today}.xlsx`;

    // Download File
    XLSX.writeFile(wb, fileName);
    toast.success("Orders exported successfully!");
  };

  return (
    <Button
      variant="contained"
      startIcon={<AssessmentOutlined />} 
      onClick={handleExport}
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        backgroundColor: '#7360F2',
        '&:hover': {
          backgroundColor: '#5b48d8',
        },
      }}
    >
      Export Orders
    </Button>
  );
};

export default ExportOrdersButton;