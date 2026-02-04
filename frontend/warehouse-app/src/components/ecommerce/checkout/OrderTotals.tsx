import React from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import { DeliveryDining } from "@mui/icons-material";

interface OrderTotalsProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  // taxes: number;
  // serviceCharge: number;
  total: number;
  formatPrice: (amount: number) => string;
}

export const OrderTotals: React.FC<OrderTotalsProps> = ({
  subtotal,
  discount,
  deliveryFee,
  platformFee,
  // taxes,
  // serviceCharge,
  total,
  formatPrice,
}) => {
  return (
    <Stack spacing={1.5} sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Original Price
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          {formatPrice(subtotal)}
        </Typography>
      </Box>

      {discount > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="body1"
            color="success.main"
            fontWeight={500}
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            Item Discounts
          </Typography>
          <Typography
            variant="body1"
            color="success.main"
            fontWeight={500}
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            -{formatPrice(discount)}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Delivery
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          color={deliveryFee === 0 ? "success.main" : "text.primary"}
        >
          <DeliveryDining sx={{ fontSize: { xs: 14, md: 16 } }} />
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
            {formatPrice(deliveryFee)}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Platform Fee (5%)
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          {formatPrice(platformFee)}
        </Typography>
      </Box>

      {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Taxes (2%)
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          {formatPrice(taxes)}
        </Typography>
      </Box> */}

      {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Service Charge
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          color="text.primary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          {formatPrice(serviceCharge)}
        </Typography>
      </Box> */}

      <Divider sx={{ my: { xs: 1, md: 1.5 } }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          sx={{ fontSize: { xs: "0.9rem", md: "1.1rem" } }}
        >
          Total
        </Typography>
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary.main"
          sx={{ fontSize: { xs: "0.9rem", md: "1.1rem" } }}
        >
          {formatPrice(total)}
        </Typography>
      </Box>
    </Stack>
  );
};
