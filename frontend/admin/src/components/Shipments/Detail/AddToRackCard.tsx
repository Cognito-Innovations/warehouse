import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import UpdateRackSlotModal from "./UpdateRackSlotModal";

interface AddToRackCardProps {
  shipmentId: string;
  onRefresh: () => void;
}

const AddToRackCard: React.FC<AddToRackCardProps> = ({ shipmentId, onRefresh }) => {
  const [rackModalOpen, setRackModalOpen] = useState(false);

  const handleOpenRackModal = () => setRackModalOpen(true);
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
          border: "1px solid #64748b",
          color: "#1e293b",
          fontSize: "0.875rem",
          fontWeight: 500,
          backgroundColor: "#fff",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
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
          onRefresh={onRefresh}
          shipments={{
            id: shipmentId,
            updated_at: "",
          }}
        />
      )}
    </>
  );
};

export default AddToRackCard;
