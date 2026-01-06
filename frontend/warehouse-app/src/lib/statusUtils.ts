import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { SvgIconComponent } from "@mui/icons-material";

export const getStatusProps = (status: string): { IconComponent: SvgIconComponent; colorClassName: string } => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "ship_request":
    case "ready to send":
      return {
        IconComponent: LocalShippingIcon,
        colorClassName: "text-blue-500",
      };
    case "payment_pending":
    case "action required":  
      return {
        IconComponent: HourglassBottomIcon,
        colorClassName: "text-yellow-500",
      };
    case "in review":
      return {
        IconComponent: FactCheckIcon,
        colorClassName: "text-indigo-500",
      };
    case "payment_approved":
      return {
        IconComponent: CheckCircleIcon,
        colorClassName: "text-green-500",
      };
    case "ready_to_ship":
      return {
        IconComponent: Inventory2Icon,
        colorClassName: "text-purple-600",
      };
    case "departed": 
      return {
        IconComponent: FlightTakeoffIcon,
        colorClassName: "text-orange-500",
      };
    case "discarded":
      return {
        IconComponent: CancelIcon,
        colorClassName: "text-red-500",
      }
    default:
      return {
        IconComponent: HelpOutlineIcon,
        colorClassName: "text-gray-400",
      };
  }
};