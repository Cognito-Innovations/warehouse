import React from "react";
import { Card, CardContent, Stack, Avatar, Box, Typography } from "@mui/material";
import { LocalShipping } from "@mui/icons-material";

export const FastDeliveryBanner: React.FC = () => {
  return (
    <Card 
      sx={{ 
        mb: 3, 
        borderRadius: 3, 
        overflow: "visible",
        position: "relative",
        bgcolor: "primary.main",
        color: "white",
      }}
    >
      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "white", color: "primary.main", width: 48, height: 48 }}>
            <LocalShipping />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Fast Delivery
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Get it delivered in 2-3 days*
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};