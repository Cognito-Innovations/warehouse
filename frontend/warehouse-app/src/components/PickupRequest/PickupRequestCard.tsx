import React from "react";
import Link from "next/link";
import { Paper, useMediaQuery, useTheme } from "@mui/material";
import PickupRequestCardMobile from "./PickupRequestCardMobile";
import PickupRequestCardDesktop from "./PickupRequestCardDesktop";
import { ROUTES } from "@/utils/constants";

interface PickupRequest {
  id: string;
  request_no?: string;
  created_at: string;
  pickup_address: string;
  supplier_name: string;
  status: string;
}

interface PickupRequestCardProps {
  request: PickupRequest;
}

const PickupRequestCard: React.FC<PickupRequestCardProps> = ({ request }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Link href={`${ROUTES.DASHBOARD}/pickup-request/${request.id}`} passHref>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          mb: 2,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-2px)",
          },
        }}
      >
        {isMobile ? (
          <PickupRequestCardMobile request={request} />
        ) : (
          <PickupRequestCardDesktop request={request} />
        )}
      </Paper>
    </Link>
  );
};

export default PickupRequestCard;

