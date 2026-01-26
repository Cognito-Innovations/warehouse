import React from "react";
import { Box, Typography } from "@mui/material";

import { useDetectUserLocation } from "@/hooks/useDetectUserLocation";
import { getCartItemPricingSummary } from "@/utils/priceUtils";
import { CartItem } from "@/types/ecommerce";

interface OrderItemsListProps {
  items: CartItem[];
  formatPrice: (amount: number) => string;
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  formatPrice,
}) => {
  const { currencySymbol } = useDetectUserLocation();

  return (
    <Box sx={{ mb: 2, maxHeight: { xs: 250, md: 300 }, overflow: "auto" }}>
      {items.map((item: CartItem) => {
        const pricing = getCartItemPricingSummary(item, currencySymbol);
        return (
          <Box
            key={item.product_id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              py: { xs: 1, md: 1.5 },
              px: { xs: 0.5, md: 0 },
              borderBottom: "1px solid #f0f0f0",
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <Box sx={{ flex: 1, mr: { xs: 1, md: 2 }, minWidth: 0 }}>
              <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                  mb: 0.5,
                  color: "text.primary",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  wordBreak: "break-word",
                }}
              >
                {item.product.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 0.5,
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                Qty: {item.quantity}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                {formatPrice(pricing.discountedUnitPrice)} each
              </Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary.main"
              sx={{
                minWidth: { xs: 50, md: 60 },
                textAlign: "right",
                fontSize: { xs: "0.875rem", md: "1rem" },
              }}
            >
              {formatPrice(pricing.lineTotal)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

