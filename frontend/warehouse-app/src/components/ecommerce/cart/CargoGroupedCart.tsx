"use client";

import { useState, useMemo } from "react";
import { Box, Paper, Typography, Collapse, Radio } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useCheckout } from "@/store/useCheckout";
import { useCartStore } from "@/store/cartStore";
import CartItemCard from "./CartItemCard";

export default function CargoGroupedCart({ groupedItems }: { groupedItems: any }) {
  const {
    selectedCargo,
    selectedProductIds,
    selectCargo,
    toggleProduct,
  } = useCheckout();

  const { cart } = useCartStore();
  const [openCargo, setOpenCargo] = useState<string | null>(null);

  const visibleGroups = useMemo(() => {
    if (!groupedItems) return [];

    return (Object.entries(groupedItems) as [string, any][])
      .map(([cargo, initialItems]) => {
        const validItems = initialItems.filter((groupItem: any) => 
          cart.some((cartItem: any) => 
            (cartItem.product_id === groupItem.product_id) || 
            (cartItem.product?.id === groupItem.product_id)
          )
        );

        return {
          cargo,
          validItems,
          productIds: validItems.map((i: any) => i.product_id)
        };
      })
      .filter((group) => group.validItems.length > 0);
  }, [groupedItems, cart]);

  const handleRadioClick = (e: React.MouseEvent, cargo: string, productIds: any[]) => {
    e.stopPropagation();
    selectCargo(cargo, productIds);
    setOpenCargo(cargo);
  };

  const handleHeaderClick = (cargo: string, productIds: any[]) => {
    selectCargo(cargo, productIds);
    setOpenCargo(openCargo === cargo ? null : cargo);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {visibleGroups.map(({ cargo, validItems, productIds }) => {
        const isCardSelected = selectedCargo === cargo;

        return (
          <Paper key={cargo} sx={{ p: 2, borderRadius: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => handleHeaderClick(cargo, productIds)}
              sx={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Radio
                  checked={isCardSelected}
                  onClick={(e) => handleRadioClick(e, cargo, productIds)}
                  onFocus={(e) => e.stopPropagation()} 
                />
                <Typography fontWeight={600} textTransform="capitalize">
                  {cargo}
                </Typography>
                
                {isCardSelected && (
                  <Typography variant="caption" color="text.secondary">
                    {selectedProductIds.length} of {validItems.length} items selected
                  </Typography>
                )}
              </Box>
              {openCargo === cargo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={openCargo === cargo}>
              <Box mt={2} display="flex" flexDirection="column" gap={1}>
                {validItems.map((item: any) => (
                  <CartItemCard
                    key={item.product_id}
                    item={item}
                    isSelected={selectedProductIds.includes(item.product_id)}
                    isDisabled={!isCardSelected} 
                    onCheckboxToggle={() => toggleProduct(item.product_id)}
                  />
                ))}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
}