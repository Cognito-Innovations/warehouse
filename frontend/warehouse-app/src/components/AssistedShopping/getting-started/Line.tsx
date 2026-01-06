import React from "react";
import { Box } from "@mui/material";

interface LineProps {
  active?: boolean;
}

export const Line: React.FC<LineProps> = ({ active = false }) => (
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