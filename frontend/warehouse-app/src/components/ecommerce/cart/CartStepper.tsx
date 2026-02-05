"use client";

import React from "react";
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { CheckCircle, Circle } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface CartStepperProps {
  activeStep: number;
}

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  "&.MuiStepConnector-root": {
    top: 12,
    left: "calc(-50% + 12px)",
    right: "calc(50% + 12px)",
  },
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: theme.palette.grey[300],
  },
  "&.Mui-active .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-completed .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
}));

const steps = ["Address", "Delivery", "Order Summary"];

export default function CartStepper({ activeStep }: CartStepperProps) {
  return (
    <Box 
      sx={{ 
        width: "100%", 
        mb: { xs: 3, md: 4 },
        px: { xs: 1, sm: 0 },
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      <Stepper
        activeStep={activeStep}
        connector={<CustomStepConnector />}
        sx={{
          "& .MuiStepLabel-root": {
            padding: 0,
          },
          "& .MuiStep-root": {
            padding: { xs: "8px 4px", sm: "8px" },
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => {
                const { active, completed } = props;
                if (completed) {
                  return (
                    <CheckCircle
                      sx={{
                        color: "primary.main",
                        fontSize: { xs: 20, sm: 24 },
                      }}
                    />
                  );
                }
                if (active) {
                  return (
                    <Box
                      sx={{
                        width: { xs: 20, sm: 24 },
                        height: { xs: 20, sm: 24 },
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      {index + 1}
                    </Box>
                  );
                }
                return (
                  <Circle
                    sx={{
                      color: "grey.400",
                      fontSize: { xs: 20, sm: 24 },
                    }}
                  />
                );
              }}
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: activeStep === index ? 600 : 400,
                  color:
                    activeStep === index
                      ? "text.primary"
                      : activeStep > index
                      ? "text.primary"
                      : "text.secondary",
                  whiteSpace: "nowrap",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
