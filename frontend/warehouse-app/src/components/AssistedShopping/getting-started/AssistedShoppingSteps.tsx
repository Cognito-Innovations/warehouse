import React from "react";
import { Box, Typography } from "@mui/material";

const StepIndicator = ({ number, label, active = false }: { number: string; label: string; active?: boolean }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: 1 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: active ? "primary.main" : "grey.500",
        color: "common.white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "1.2rem",
        mb: 1,
      }}
    >
      {number}
    </Box>
    <Typography variant="caption" sx={{ color: active ? "primary.main" : "grey.500", fontWeight: "bold" }}>
      {label}
    </Typography>
  </Box>
);

const Line = ({ active = false }: { active?: boolean }) => (
  <Box sx={{ width: { xs: 20, sm: 40 }, height: 2, bgcolor: active ? "primary.main" : "grey.300", mb: 2.5 }} />
);

interface AssistedShoppingStepsProps {
  currentStep: number;
}

export const AssistedShoppingSteps = ({ currentStep }: AssistedShoppingStepsProps) => {
  const isStep1Active = currentStep >= 1;
  const isStep2Active = currentStep >= 2;
  const isLine1Active = currentStep >= 2;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4, mb: 4, gap: 1 }}>
      <StepIndicator number="1" label="LINK" active={isStep1Active} />
      <Line active={isLine1Active} />
      <StepIndicator number="2" label="DETAILS" active={isStep2Active} />
    </Box>
  );
};