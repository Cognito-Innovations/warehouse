import React from "react";
import { Box, Card, Chip, Typography } from "@mui/material";
import { getStatusColor } from "../../data/shipmentExports";

interface ShipmentHeaderProps {
  shipment: any;
}

const ShipmentHeader: React.FC<ShipmentHeaderProps> = ({ shipment }) => {
  const status = getStatusColor(shipment.status);

  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 2, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {shipment.requestCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            UFLASH INTERNATIONAL COURIER, India
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {shipment.boxes?.length || 0} Box / 0 Shipment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created at {new Date(shipment.created_at).toLocaleString()}
          </Typography>
        </Box>
        <Chip
          label={shipment.status}
          size="small"
          sx={{
            color: status.color,
            bgcolor: status.bgColor,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      </Box>
    </Card>
  );
};

export default ShipmentHeader;