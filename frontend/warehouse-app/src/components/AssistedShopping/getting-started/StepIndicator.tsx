import React from "react";
import { Box, Typography } from "@mui/material";

interface StepIndicatorProps {
  number: number;
  label: string;
  active?: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
    number,
    label,
    active = false,
}) => (
  <Box
    sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mx: { xs: 0.5, sm: 1, md: 1.5 }
    }}
  >
    <Box
      sx={{
        width: { xs: 48, sm: 52, md: 56 },
        height: { xs: 48, sm: 52, md: 56 },
        borderRadius: "50%",
        bgcolor: active ? "primary.main" : "grey.400",
        color: "common.white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
        mb: { xs: 1, md: 1.5 },
        transition: "all 0.3s ease",
        boxShadow: active 
          ? "0 4px 12px rgba(124, 58, 237, 0.3)" 
          : "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {number}
    </Box>
    <Typography 
      variant="caption" 
      sx={{ 
        color: active ? "primary.main" : "grey.600", 
        fontWeight: { xs: 600, md: 600 },
        fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}
    >
      {label}
    </Typography>
  </Box>
);