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
