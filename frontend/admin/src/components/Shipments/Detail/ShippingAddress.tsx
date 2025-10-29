import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

interface ShippingAddressProps {
  shipments: any;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ shipments }) => {
  const user = shipments?.user;
  const courier = user?.preference?.courier;
  const address = courier?.address || '';

  const addressParts = address.split(',').map(part => part.trim());
  const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';
  const countryCode = country.substring(0, 2).toLowerCase();

  const flagUrl = countryCode
    ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
    : "";

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
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
            }}
          >
            {flagUrl ? (
              <Box
                component="img"
                src={flagUrl}
                alt={country}
                sx={{
                  width: 32,
                  height: 24,
                  borderRadius: "4px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <PublicIcon sx={{ color: "#3b82f6" }} />
            )}
          </Box>

          <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
            {address}
          </Typography>

          {address?.zip_code && (  
            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
              POSTAL CODE: {address?.zip_code}
            </Typography>
          )}

          <Typography variant="body2" sx={{ color: "#1e293b" }}>
            {user?.name} ({courier?.phone_number})
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ShippingAddress;
