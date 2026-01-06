import React from "react";
import { Box } from "@mui/material";

import { StepIndicator } from "./StepIndicator";
import { Line } from "./Line";
import { ASSISTED_SHOPPING_STEPS } from "@/utils/constants";

interface AssistedShoppingStepsProps {
  currentStep: number;
}

export const AssistedShoppingSteps = ({ currentStep }: AssistedShoppingStepsProps) => {
  const components: React.ReactNode[] = [];

  ASSISTED_SHOPPING_STEPS.forEach((step, index) => {
    const stepNumber = step.number;
    const isActive = currentStep >= stepNumber;
    
    components.push(
      <StepIndicator
        key={`step-${step.number}`}
        number={step.number}
        label={step.label}
        active={isActive}
      />
    );

    if (index < ASSISTED_SHOPPING_STEPS.length - 1) {
      const nextStepNumber = ASSISTED_SHOPPING_STEPS[index + 1].number;
      const isLineActive = currentStep >= nextStepNumber;
      
      components.push(
        <Line
          key={`line-${index}`}
          active={isLineActive}
        />
      );
    }
  });

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
      {components}
    </Box>
  );
};