import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useShipmentDetail } from "../../../contexts/ShipmentDetailContext";
import UpdateRackSlotModal from "./UpdateRackSlotModal";

const AddToRackCard: React.FC = () => {
  const { isDiscarded } = useShipmentDetail();

  const [rackModalOpen, setRackModalOpen] = useState(false);

  const handleOpenRackModal = () => {
    if (!isDiscarded) {
      setRackModalOpen(true);
    }
  }

  const handleCloseRackModal = () => setRackModalOpen(false);

  return (
    <>
      <Box
        onClick={handleOpenRackModal}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          px: 2.5,
          py: 1.2,
          borderRadius: "8px",
          border: isDiscarded ? "1px solid #cbd5e1" : "1px solid #64748b",
          color: isDiscarded ? "#64748b" : "#1e293b",
          fontSize: "0.875rem",
          fontWeight: 500,
          backgroundColor: isDiscarded ? "#f1f5f9" : "#fff",
          cursor: isDiscarded ? "not-allowed" : "pointer",
          opacity: isDiscarded ? 0.6 : 1,
          transition: "all 0.2s ease",
          "&:hover": !isDiscarded && {
            backgroundColor: "#f8fafc",
            borderColor: "#475569",
          },
        }}
      >
        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
          Add to rack →
        </Typography>
      </Box>

      {rackModalOpen && (
        <UpdateRackSlotModal
          open={rackModalOpen}
          onClose={handleCloseRackModal}
        />
      )}
    </>
  );
};

export default AddToRackCard;
