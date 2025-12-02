import React from "react";
import { AppBar, Toolbar, Box, IconButton, Stack, Typography, Chip } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface CheckoutHeaderProps {
  itemCount: number;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ itemCount }) => {
  const router = useRouter();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: "white",
        borderBottom: "1px solid #e9ecef",
        px: { xs: 1, sm: 2 },
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ 
              color: "text.primary",
              "&:hover": { bgcolor: "grey.100" }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Checkout
            </Typography>
            <Chip 
              label={itemCount} 
              size="small" 
              color="primary" 
              sx={{ 
                height: 20, 
                fontSize: "0.75rem",
                fontWeight: 600 
              }} 
            />
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};