import {
  Groups as GroupsIcon,
  HourglassEmpty as DraftIcon,
  Warning as WarningIcon,
  FileDownload as ShipRequestIcon,
  CreditCard as PaymentIcon,
  CheckCircle as ApprovalIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingIcon,
  FormatQuote as QuoteIcon,
} from '@mui/icons-material';
import type { ChartConfig } from '../components/Dashboard/DashboardCharts';
import type { MetricCardProps } from '../components/Dashboard/MetricCard';

export const metricsData: MetricCardProps[] = [
  { title: 'Customers', value: '21951', subtitle: 'Total', color: '#22c55e', bgColor: '#dcfce7', icon: <GroupsIcon /> },
  { title: 'Draft', value: '29', subtitle: 'Packages', color: '#ec4899', bgColor: '#fce7f3', icon: <DraftIcon /> },
  { title: 'Action Required', value: '49', subtitle: 'Packages', color: '#ef4444', bgColor: '#fee2e2', icon: <WarningIcon /> },
  { title: 'Ship Request', value: '13', subtitle: 'Shipment', color: '#ec4899', bgColor: '#fce7f3', icon: <ShipRequestIcon /> },
  { title: 'Payment Pending', value: '26', subtitle: 'Shipment', color: '#ef4444', bgColor: '#fee2e2', icon: <PaymentIcon /> },
  { title: 'Payment Approval', value: '1', subtitle: 'Shipment', color: '#3b82f6', bgColor: '#dbeafe', icon: <ApprovalIcon /> },
  { title: 'Ready to Ship', value: '215', subtitle: 'Shipment', color: '#22c55e', bgColor: '#dcfce7', icon: <ShippingIcon /> },
  { title: 'Shipped', value: '592', subtitle: 'Shipment', color: '#64748b', bgColor: '#f1f5f9', icon: <InventoryIcon /> },
  { title: 'Pickup Requested', value: '9', subtitle: 'Pickup', color: '#ec4899', bgColor: '#fce7f3', icon: <ShippingIcon /> },
  { title: 'Shopping Requested', value: '3', subtitle: 'Assist Purchase', color: '#ec4899', bgColor: '#fce7f3', icon: <ShoppingIcon /> },
  { title: 'Quotation Confirm', value: '0', subtitle: 'Assist Purchase', color: '#22c55e', bgColor: '#dcfce7', icon: <QuoteIcon /> },
  { title: 'Payment Approval', value: '0', subtitle: 'Assist Purchase', color: '#3b82f6', bgColor: '#dbeafe', icon: <ApprovalIcon /> },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const chartsData: ChartConfig[] = [
  {
    title: 'Packages',
    subtitle: 'Year 2025',
    xLabels: months,
    series: [
      { data: [15, 8, 12, 105, 90, 95, 200, 187, 45, 18, 15, 8], label: 'Shipped', color: '#3b82f6', area: true },
      { data: [15, 8, 12, 105, 90, 95, 200, 187, 45, 18, 15, 8].map(v => v * 0.8), label: 'Received', color: '#f97316', area: true },
    ],
    gridSize: { xs: 12, lg: 6 },
  },
  {
    title: 'Shipments',
    subtitle: 'Year 2025',
    xLabels: months,
    series: [
      { data: [2, 15, 8, 25, 28, 45, 52, 38, 15, 8, 5, 2], label: 'Shipped', color: '#ec4899', area: true },
      { data: [2, 15, 8, 25, 28, 45, 52, 38, 15, 8, 5, 2].map(v => v * 1.2), label: 'Received', color: '#06b6d4', area: true },
    ],
    gridSize: { xs: 12, lg: 6 },
  },
];
