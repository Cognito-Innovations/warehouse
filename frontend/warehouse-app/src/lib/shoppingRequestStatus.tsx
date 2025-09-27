import {
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as HourglassIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

export const shoppingRequestMessages: Record<string, string> = {
  REQUESTED: "Your request has been received. We will get back to you shortly.",
  QUOTATION_READY: "Quotation is ready. Please review the quotation and confirm.",
  INVOICED: "Invoice is ready. Please make the payment and upload payment slip.",
  PAYMENT_PENDING: "Your payment slip has been uploaded and is pending approval from our team.",
  PAYMENT_APPROVED: "Your payment has been approved. We will proceed with your order.",
  CONFIRMED: "Your order has been confirmed. We will proceed with the purchase.",
  ORDER_PLACED: "Your order has been placed successfully. We will now start processing and keep you updated on the progress.",
  CANCELLED: "This request has been cancelled.",
};

export const STATUS_ICONS: Record<
  string,
  { Icon: React.ElementType; }
> = {
  REQUESTED: {
    Icon: HourglassIcon,
  },
  QUOTED: {
    Icon: ReceiptIcon,
  },
  QUOTATION_CONFIRMED: {
    Icon: CheckIcon,
  },
  INVOICED: {
    Icon: ReceiptIcon,
  },
  PAYMENT_PENDING: {
    Icon: PaymentIcon,
  },
  PAYMENT_APPROVED: {
    Icon: CheckIcon,
  },
  ORDER_PLACED: {
    Icon: ShoppingCartIcon,
  },
  CANCELLED: {
    Icon: CancelIcon,
  },
};