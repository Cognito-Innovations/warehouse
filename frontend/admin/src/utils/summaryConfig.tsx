import type { SummaryCardConfig } from "../components/common/RequestSummary";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';

export const shoppingSummaryConfig: SummaryCardConfig[] = [
  {
    title: "Pending Accepted",
    status: "REQUESTED",
    icon: <ShoppingBagOutlinedIcon />,
    bgColor: "#F87171",
  },
  {
    title: "Quotation Confirmed",
    status: "QUOTATION_CONFIRMED",
    icon: <RedeemOutlinedIcon />,
    bgColor: "#EC4899",
  },
  {
    title: "Payment Pending",
    status: "PAYMENT_PENDING",
    icon: <FlightTakeoffOutlinedIcon />,
    bgColor: "#6366F1",
  },
];

export const pickupSummaryConfig: SummaryCardConfig[] = [
    {
        title: "Pending Accepted",
        status: ["requested", "accepted"],
        icon: <ShoppingBagOutlinedIcon />,
        bgColor: "#F87171",
    },
    {
        title: "Quotation Confirmed",
        status: "quoted",
        icon: <RedeemOutlinedIcon />,
        bgColor: "#EC4899",
    },
    {
        title: "Picked",
        status: "picked",
        icon: <FlightTakeoffOutlinedIcon />,
        bgColor: "#34D399",
    },
];