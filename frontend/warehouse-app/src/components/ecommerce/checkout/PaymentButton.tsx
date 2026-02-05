import React from "react";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
import { Payment } from "@mui/icons-material";

interface PaymentButtonProps {
  processing: boolean;
  addressLoading: boolean;
  disabled: boolean;
  total: number;
  formatPrice: (amount: number) => string;
  onClick: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  processing,
  addressLoading,
  disabled,
  total,
  formatPrice,
  onClick,
}) => {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      startIcon={<Payment />}
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: 3,
        py: { xs: 1.5, md: 2 },
        fontSize: { xs: "0.9375rem", md: "1.1rem" },
        fontWeight: 600,
        textTransform: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "all 0.2s ease",
        bgcolor: "primary.main",
        "&:hover": {
          bgcolor: "primary.dark",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          transform: "translateY(-1px)",
        },
        "&:disabled": {
          bgcolor: "grey.300",
          color: "grey.500",
          boxShadow: "none",
          transform: "none",
        },
      }}
    >
      {processing ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} color="inherit" />
          <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
            Processing Payment...
          </Typography>
        </Box>
      ) : addressLoading ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} color="inherit" />
          <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
            Fetching Address...
          </Typography>
        </Box>
      ) : (
        `Pay & Place Order • ${formatPrice(total)}`
      )}
    </Button>
  );
};

