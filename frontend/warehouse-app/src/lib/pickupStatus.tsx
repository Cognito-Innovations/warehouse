import type { ReactElement } from "react";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export const statusConfig: Record<string, { color: string; icon: ReactElement }> = {
  REQUESTED: { color: "#F59E0B", icon: <HourglassTopIcon sx={{ color: "#F59E0B" }} /> }, // yellow
  QUOTED: { color: "#10B981", icon: <CheckCircleIcon sx={{ color: "#10B981" }} /> },    // green
  PICKED: { color: "#10B981", icon: <CheckCircleIcon sx={{ color: "#10B981" }} /> },    // green
  CONFIRMED: { color: "#10B981", icon: <CheckCircleIcon sx={{ color: "#10B981" }} /> }, // green
  CANCELLED: { color: "#EF4444", icon: <CancelIcon sx={{ color: "#EF4444" }} /> },      // red
};

export enum PICKUP_REQUEST_STATUS {
  REQUESTED = "REQUESTED",
  QUOTED = "QUOTED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  PICKED = "PICKED",
  REJECTED = "REJECTED",
}