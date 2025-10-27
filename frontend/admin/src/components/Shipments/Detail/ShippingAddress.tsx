import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

interface ShippingAddressProps {
  shipments: any;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ shipments }) => {
  const address = shipments?.shipping_address || {};

  return (
    <Box sx={{ width: '500px', mt: 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "#1e293b",
          mb: 1,
        }}
      >
        Shipping Address
      </Typography>

      <Card
        sx={{
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 0.8,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              bgcolor: "#f1f5f9",
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PublicIcon sx={{ color: "#3b82f6" }} />
          </Box>

          <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
            {address.line1 || "Cozy, kashinaru magu, Hithadhoo, S Hithadhoo"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#374151" }}>
            {address.line2 || "Addu, South"}
          </Typography>

          <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
            POSTAL CODE: {address.postal_code || "19020"}
          </Typography>

          <Typography variant="body2" sx={{ color: "#1e293b" }}>
            {address.contact_name || "Ahmed Saamee Rasheed"} (
            {address.contact_number || "9174966"})
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ShippingAddress;
