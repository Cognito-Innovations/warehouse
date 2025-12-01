import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { ecommerceData } from "@/data/ecommerceData";

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
  const isMaxLimitReached = quantity >= stockQuantity;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        border: `1px solid ${ecommerceData.ui.colors.borderColor}`,
        borderRadius: 1,
        height: 32,
        width: { xs: "100%", sm: "auto" },
        justifyContent: "space-between",
      }}
    >
      <IconButton
        size="small"
        onClick={onDecrement}
        sx={{
          width: 40,
          height: 32,
          p: 0,
          position: "relative",
        }}
      >
        <Remove sx={{ fontSize: 16 }} />
      </IconButton>
      
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ minWidth: 20, textAlign: "center" }}
      >
        {quantity}
      </Typography>
      
      <IconButton
        size="small"
        onClick={onIncrement}
        disabled={isMaxLimitReached}
        sx={{
          width: 40,
          height: 32,
          p: 0,
          position: "relative",
          color: isMaxLimitReached ? "action.disabled" : "inherit",
        }}
      >
        <Add sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}