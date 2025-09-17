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
  QUOTATION_READY: "Quotation is ready. Please review the quotation and confirm. You can unselect the items you don't want to purchase.",
  INVOICED: "Invoice is ready. Please make the payment and upload payment slip.",
  PAYMENT_PENDING: "Your payment slip has been uploaded and is pending approval from our team.",
  PAYMENT_APPROVED: "Your payment has been approved. We will proceed with your order.",
  CONFIRMED: "Your order has been confirmed. We will proceed with the purchase.",
  ORDER_PLACED: "Your order has been placed successfully. We will now start processing and keep you updated on the progress.",
  CANCELLED: "This request has been cancelled.",
};

export const STATUS_ICONS: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  REQUESTED: {
    icon: <HourglassIcon className="w-5 h-5 text-gray-500" />,
    color: "text-gray-600",
  },
  QUOTED: {
    icon: <ReceiptIcon className="w-5 h-5 text-blue-500" />,
    color: "text-blue-600",
  },
  QUOTATION_CONFIRMED: {
    icon: <CheckIcon className="w-5 h-5 text-green-500" />,
    color: "text-green-600",
  },
  INVOICED: {
    icon: <ReceiptIcon className="w-5 h-5 text-purple-500" />,
    color: "text-purple-600",
  },
  PAYMENT_PENDING: {
    icon: <PaymentIcon className="w-5 h-5 text-orange-500" />,
    color: "text-orange-600",
  },
  PAYMENT_APPROVED: {
    icon: <CheckIcon className="w-5 h-5 text-green-600" />,
    color: "text-green-700",
  },
  ORDER_PLACED: {
    icon: <ShoppingCartIcon className="w-5 h-5 text-indigo-500" />,
    color: "text-indigo-600",
  },
  CANCELLED: {
    icon: <CancelIcon className="w-5 h-5 text-red-500" />,
    color: "text-red-600",
  },
};