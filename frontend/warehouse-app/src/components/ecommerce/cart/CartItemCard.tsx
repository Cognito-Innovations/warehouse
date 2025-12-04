"use client";

import React, { useCallback } from "react";
import { Box, Typography, IconButton, Checkbox, Chip, Stack, Divider } from "@mui/material";
import { Add, Remove, Delete, LocationOn, Inventory } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";
import { formatDiscountPercentage } from "@/lib/utils";
import { getCurrencyForCountry } from "@/utils/currency";
import { formatPrice, getCartItemPricingSummary } from "@/utils/priceUtils";
import { ROUTES } from "@/utils/constants";
import { CartItemCardProps, EcommerceProduct } from "@/types/ecommerce";

export default function CartItemCard({
  item,
  isSelected,
  currencySymbol,
  selectedCountry,
}: CartItemCardProps) {
  const router = useRouter();
  const {
    checkoutProducts,
    toggleCartItemSelection,
    removeProductFromCart,
    setCartItemQuantity,
  } = useCartStore();

  const handleProductClick = (e: React.MouseEvent, product: EcommerceProduct) => {
    const blocked = ["BUTTON", "svg", "path", "INPUT"];
    if (blocked.includes((e.target as HTMLElement).tagName)) return;

    router.push(`${ROUTES.PRODUCT}/${product.slug}`);
  }

  const handleItemSelect = (itemId: string, isChecked: boolean) => {
    const isCurrentlySelected = checkoutProducts.includes(itemId);
    if (isChecked !== isCurrentlySelected) {
      toggleCartItemSelection(itemId);
    }
  };

  const handleQuantityChange = useCallback(async (identifier: string, newQuantity: number) => {
    await setCartItemQuantity(identifier, newQuantity, selectedCountry);
  }, [setCartItemQuantity, selectedCountry]);

  const handleRemoveItem = useCallback(async (identifier: string) => {
    await removeProductFromCart(identifier, selectedCountry);
  }, [removeProductFromCart, selectedCountry]);

  const effectiveId = item.product_id!;

  const pricing = getCartItemPricingSummary(item);
  const unitPrice = pricing.discountedUnitPrice;
  const totalPrice = pricing.lineTotal;
  const originalPrice = pricing.originalUnitPrice;
  const hasDiscount = pricing.discountPerUnit > 0;  
  const unitValue = item.product.unit_value || 0;
  const measurementLabel = item.product.measurement?.label || "";
  const placeholderImage = `https://placehold.co/160x160?text=${item.product.name}`;
  const imageUrl = item.product.image_url || placeholderImage;
  const stockStatus = item.product.stock_quantity > 0
    ? item.product.stock_quantity < 10
      ? `Only ${item.product.stock_quantity} left`
      : "In Stock"
    : "Out of Stock";
  const currentCountry = selectedCountry || 'United States of America';
  const currencyInfo = getCurrencyForCountry(currentCountry);
  const currencyStr = currencySymbol || pricing.currency || currencyInfo.symbol;

  const formatLocalPrice = (price: number) => formatPrice(price, currencyStr);
  return (
    <Box
      onClick={(e) => handleProductClick(e, item.product)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        p: { xs: 2, sm: 2.5 },
        mb: 2,
        borderRadius: 3,
        bgcolor: "white",
        border: `1px solid ${isSelected ? "success.main" : "#e0e0e0"}`,
        boxShadow: isSelected
          ? "0 4px 12px rgba(76, 175, 80, 0.15)"
          : "0 2px 8px rgba(0, 0, 0, 0.08)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)",
        },
        "&:last-child": {
          mb: 0,
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        {/* Selection Checkbox */}
        <Box sx={{ display: "flex", alignItems: "flex-start", pt: 0.5 }}>
          <Checkbox
            checked={isSelected}
            onChange={(e) => handleItemSelect(effectiveId, e.target.checked)}
            sx={{
              color: "success.main",
              "&.Mui-checked": {
                color: "success.main",
              },
            }}
          />
        </Box>

        {/* Product Image */}
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={item.product.name}
            sx={{
              borderRadius: 2,
              objectFit: "cover",
              width: { xs: 100, sm: 120, md: 140 },
              height: { xs: 100, sm: 120, md: 140 },
              bgcolor: "grey.100",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onError={(e: any) => {
              e.target.src = placeholderImage;
            }}
          />
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        minWidth: 0, 
        flexDirection: { xs: 'column', sm: 'row' } 
      }}>
        {/* Product Details */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75, flexWrap: 'wrap' }}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                fontSize: "1.1rem",
                color: "text.primary",
              }}
            >
              {item.product.name}
            </Typography>
            {hasDiscount && (
              <Chip
                label={formatDiscountPercentage(item.product.discount_percentage, "OFF")}
                size="small"
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  height: 22,
                }}
              />
            )}
            {/* Stock Status */}
            <Chip
              label={stockStatus}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                bgcolor: item.product.stock_quantity > 0
                  ? item.product.stock_quantity < 10
                    ? "warning.light"
                    : "success.light"
                  : "error.light",
                color: item.product.stock_quantity > 0
                  ? item.product.stock_quantity < 10
                    ? "warning.dark"
                    : "success.dark"
                  : "error.dark",
              }}
            />

          </Box>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                Category:
              </Typography>
              <Typography
                variant="caption"
                fontWeight={500}
                sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}
              >
                {item.product.category?.name || "N/A"}
              </Typography>
            </Box>

          </Stack>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 1.5 }}>
            {unitValue > 0 && measurementLabel && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Inventory sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.8rem" }}
                >
                  {unitValue} {measurementLabel}
                </Typography>
              </Box>
            )}

            {item.product.country?.name && (
              <>
                {unitValue > 0 && <Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: "center" }} />}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {item.product.country.name}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>

          {/* Quantity Selector */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(effectiveId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              sx={{
                border: "1.5px solid",
                borderColor: item.quantity <= 1 ? "action.disabled" : "grey.300",
                bgcolor: "white",
                borderRadius: "50%",
                width: 32,
                height: 32,
                transition: "all 0.2s ease",
                "&:hover:not(:disabled)": {
                  bgcolor: "grey.50",
                  borderColor: "primary.main",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Remove sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                minWidth: 32,
                textAlign: "center",
                fontSize: "1rem",
              }}
            >
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(effectiveId, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock_quantity}
              sx={{
                border: "1.5px solid",
                borderColor: item.quantity >= item.product.stock_quantity ? "action.disabled" : "grey.300",
                bgcolor: "white",
                borderRadius: "50%",
                width: 32,
                height: 32,
                transition: "all 0.2s ease",
                "&:hover:not(:disabled)": {
                  bgcolor: "grey.50",
                  borderColor: "primary.main",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Add sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Quantity, Price and Remove */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", sm: "flex-end" },
            flexShrink: 0,
            minWidth: { xs: "unset", sm: 120 },
            width: { xs: "100%", sm: "auto" },
            mt: { xs: 2, sm: 0 },
          }}
        >
          <IconButton
            size="small"
            onClick={() => handleRemoveItem(effectiveId)}
            sx={{
              color: "text.secondary",
              width: 36,
              height: 36,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "error.lighter",
                color: "error.main",
                transform: "scale(1.1)",
              },
              alignSelf: { xs: 'flex-end', sm: 'center' },
              mt: { xs: -5, sm: 0 },
            }}
          >
            <Delete sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Price Section */}
          <Box sx={{ 
            textAlign: { xs: "left", sm: "right" },
            width: '100%',
          }}>
            {/* Original Unit Price */}
            {hasDiscount && (
              <Typography
                variant="caption"
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  display: "block",
                  mb: 0.25,
                }}
              >
                {formatLocalPrice(originalPrice)}/unit
              </Typography>
            )}

            {/* Discounted Unit Price */}
            <Typography
              variant="body2"
              sx={{
                color: hasDiscount ? "primary.main" : "text.primary",
                fontSize: "0.875rem",
                fontWeight: 500,
                display: "block",
                mb: 0.5,
              }}
            >
              {formatLocalPrice(unitPrice)}/unit
            </Typography>

            {/* Calculation: Quantity × Unit Price = Total */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                fontFamily: "monospace",
                display: "block",
              }}
            >
              {item.quantity} × {formatLocalPrice(unitPrice)} = <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>{formatLocalPrice(totalPrice)}</Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

