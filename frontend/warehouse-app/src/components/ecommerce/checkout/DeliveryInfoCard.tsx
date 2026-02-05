import React from "react";
import { Card, CardContent, Stack, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Timer, DeliveryDining, CheckCircle, Security } from "@mui/icons-material";

export const DeliveryInfoCard: React.FC = () => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: 3, 
        border: "1px solid #e9ecef",
        bgcolor: "grey.50",
        height: "100%"
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
          <Timer sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Delivery Details
          </Typography>
        </Stack>

        <List dense sx={{ p: 0, "& .MuiListItem-root": { py: 0.5 } }}>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32, color: "success.main" }}>
              <DeliveryDining sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Lightning Fast Delivery" 
              primaryTypographyProps={{ fontWeight: 500, color: "text.primary" }}
              secondary="Typically within 2-3 days" 
              secondaryTypographyProps={{ color: "text.secondary" }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32, color: "success.main" }}>
              <CheckCircle sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Fresh & Packed with Care" 
              primaryTypographyProps={{ fontWeight: 500, color: "text.primary" }}
              secondary="All products carefully selected and packaged" 
              secondaryTypographyProps={{ color: "text.secondary" }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32, color: "warning.main" }}>
              <Security sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Secure Checkout" 
              primaryTypographyProps={{ fontWeight: 500, color: "text.primary" }}
              secondary="Your data is protected with top encryption" 
              secondaryTypographyProps={{ color: "text.secondary" }}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};