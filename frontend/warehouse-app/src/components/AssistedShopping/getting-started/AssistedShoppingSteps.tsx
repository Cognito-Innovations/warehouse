import React from "react";
import { Box, Typography } from "@mui/material";

const StepIndicator = ({ number, label, active = false }: { number: string; label: string; active?: boolean }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: { xs: 0.5, sm: 1, md: 1.5 } }}>
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

const Line = ({ active = false }: { active?: boolean }) => (
  <Box 
    sx={{ 
      width: { xs: 30, sm: 60, md: 100 }, 
      height: { xs: 3, md: 4 }, 
      bgcolor: active ? "primary.main" : "grey.300", 
      mb: { xs: 2, md: 2.5 },
      borderRadius: 2,
      transition: "all 0.3s ease",
      mx: { xs: 0.5, sm: 1 }
    }} 
  />
);

interface AssistedShoppingStepsProps {
  currentStep: number;
}

export const AssistedShoppingSteps = ({ currentStep }: AssistedShoppingStepsProps) => {
  const isStep1Active = currentStep >= 1;
  const isStep2Active = currentStep >= 2;
  const isLine1Active = currentStep >= 2;

  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        mt: { xs: 3, md: 5 }, 
        mb: { xs: 3, md: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <StepIndicator number="1" label="LINK" active={isStep1Active} />
      <Line active={isLine1Active} />
      <StepIndicator number="2" label="DETAILS" active={isStep2Active} />
    </Box>
  );
};