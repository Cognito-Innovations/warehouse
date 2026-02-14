import type { StatusOption } from "../components/Orders/EditOrderStatusModal";
import type { UserRole } from "../data/menuItems";

export const PromiseStatus = {
  Fulfilled: 'fulfilled',
  Rejected: 'rejected',
} as const;

export const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

export const PACKAGE_STATUSES = {
  ACTION_REQUIRED: "Action Required",
  IN_REVIEW: "In Review",
  DRAFT: "Draft",
} as const;

export const PACKAGE_STATUS_CARDS = [
  {
    key: PACKAGE_STATUSES.ACTION_REQUIRED,
    title: "Action Required",
    color: "#ef4444",
    bgColor: "#fee2e2",
    icon: "WarningIcon",
  },
  {
    key: PACKAGE_STATUSES.IN_REVIEW,
    title: "In Review",
    color: "#3b82f6",
    bgColor: "#dbeafe",
    icon: "InfoIcon",
  },
  {
    key: PACKAGE_STATUSES.DRAFT,
    title: "Draft",
    color: "#ec4899",
    bgColor: "#fce7f3",
    icon: "InfoIcon",
  },
] as const;

export const ORDER_STATUS_OPTIONS: StatusOption[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export const ROLES: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

export const SHOPPING_REQUEST_STATUS_OPTIONS = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'ORDER_PLACED', label: 'Order Placed' },
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

export const PICKUP_REQUEST_STATUS_OPTIONS = [
  { value: 'requested', label: 'Requested' },
  { value: 'quoted', label: 'Quotation Confirmed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'picked', label: 'Picked' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const FALLBACK_IMAGE = 'https://placehold.co/100x100?text=No+Image'

export const SHIPMENT_MEASUREMENTS_TABLE_HEADERS = [
  '#',
  'Weight',
  'Volumetric Weight(L×W×H)',
  'Label',
];

export const SHIPMENT_EXPORT_TABLE_HEADERS = [
  "Serial #",
  "Date",
  "MAWB",
  "Count",
  "Created By",
  "Status",
  "Actions",
];

export const BOX_SHIPMENTS_TABLE_HEADERS = [
  { label: "Shipment No." },
  { label: "Tracking No." },
  { label: "Customer" },
  { label: "Date" },
  { label: "", align: "center" as const },
];

export const PRE_ARRIVALS_TABLE_HEADERS = [
  'OTP / Tracking No',
  'Customer',
  'ETA',
  'Created At',
  'Status',
  'Actions',
];