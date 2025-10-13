import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { SvgIconComponent } from "@mui/icons-material";

export const getStatusProps = (status: string): { IconComponent: SvgIconComponent; colorClassName: string } => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "request ship":
      return {
        IconComponent: LocalShippingIcon,
        colorClassName: "text-blue-500",
      };
    case "payment pending":
      return {
        IconComponent: HourglassBottomIcon,
        colorClassName: "text-yellow-500",
      };
    case "payment approved":
      return {
        IconComponent: CheckCircleIcon,
        colorClassName: "text-green-500",
      };
    case "ready to ship":
      return {
        IconComponent: Inventory2Icon,
        colorClassName: "text-purple-600",
      };
    case "departed": 
      return {
        IconComponent: FlightTakeoffIcon,
        colorClassName: "text-orange-500",
      }
    default:
      return {
        IconComponent: HelpOutlineIcon,
        colorClassName: "text-gray-400",
      };
  }
};