import React from 'react';
import { AssessmentOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { formatDateTime } from "../../utils/formatDateTime";

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

interface ExportOrdersButtonProps {
  orders: OrderRow[];
}

const ExportOrdersButton: React.FC<ExportOrdersButtonProps> = ({ orders }) => {

  const handleExport = () => {
    if (!orders || orders.length === 0) {
      toast.error("No orders available to export.");
      return;
    }

    const data = orders.map((order) => ({
      "Order Number": order.order_number,
      "Customer Name": order.customer_name,
      "Item Count": order.item_count,
      "Total": Number(order.total),
      "Payment Method": order.payment_method,
      "Order Date": order.order_date ? formatDateTime(order.order_date) : '-',
      "Status": order.status,
      "Payment Status": order.payment_status,
    }));

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