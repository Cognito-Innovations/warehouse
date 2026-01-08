import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

interface ProductQuantityControlProps {
  quantity: number;
  stockQuantity: number;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
}

export default function ProductQuantityControl({
  quantity,
  stockQuantity,
  onIncrement,
  onDecrement,
}: ProductQuantityControlProps) {
  const theme = useTheme();
  const isMaxLimitReached = quantity >= stockQuantity;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 1,
        height: 32,
        width: { xs: "auto", sm: "auto" },
        justifyContent: "space-between",
        ml: 1
      }}
    >
      <IconButton
        size="small"
        onClick={onDecrement}
        sx={{
          width: 24,
          height: 32,
          p: 0,
          position: "relative",
          color: "primary.main"
        }}
      >
        <Remove sx={{ fontSize: 14 }} />
      </IconButton>
      
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ minWidth: 20, textAlign: "center", color: "primary.main" }}
      >
        {quantity}
      </Typography>
      
      <IconButton
        size="small"
        onClick={onIncrement}
        disabled={isMaxLimitReached}
        sx={{
          width: 24,
          height: 32,
          p: 0,
          position: "relative",
          color: isMaxLimitReached ? "action.disabled" : "primary.main"
        }}
      >
        <Add sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
}