import type { StatusOption } from "../components/Orders/EditOrderStatusModal";

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