import {
  HourglassEmpty as PendingIcon,
  TaskAlt as ConfirmedIcon,
  Settings as ProcessingIcon,
  LocalShipping as ShippedIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelIcon,
  Replay as RefundedIcon,
} from "@mui/icons-material";

export const STATUS_ICONS: Record<
  string,
  { Icon: React.ElementType }
> = {
  PENDING: {
    Icon: PendingIcon,
  },
  CONFIRMED: {
    Icon: ConfirmedIcon,
  },
  PROCESSING: {
    Icon: ProcessingIcon,
  },
  SHIPPED: {
    Icon: ShippedIcon,
  },
  DELIVERED: {
    Icon: DeliveredIcon,
  },
  CANCELLED: {
    Icon: CancelIcon,
  },
  REFUNDED: {
    Icon: RefundedIcon,
  },
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "text-green-500";
    case "cancelled": return "text-red-500";
    case "shipped": return "text-blue-500";
    case "pending": return "text-yellow-500";
    default: return "text-gray-500";
  }
};