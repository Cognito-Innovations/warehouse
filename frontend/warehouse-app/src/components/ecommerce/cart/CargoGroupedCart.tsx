"use client";

import { useState } from "react";
import { Box, Paper, Typography, Collapse, Radio } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useCheckout } from "@/store/useCheckout";
import CartItemCard from "./CartItemCard";

export default function CargoGroupedCart({ groupedItems, currency }: { groupedItems: any, currency: string }) {
  const {
    selectedCargo,
    selectedProductIds,
    selectCargo,
    toggleProduct,
  } = useCheckout();

  const [openCargo, setOpenCargo] = useState<string | null>(null);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {Object.entries(groupedItems).map(([cargo, items]: [string, any[]]) => {
        const productIds = items.map((i) => i.product_id);

        const isCardSelected = selectedCargo === cargo;

        const handleRadioClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          selectCargo(cargo, productIds);
          setOpenCargo(cargo);
        };

        const handleHeaderClick = () => {
          setOpenCargo(openCargo === cargo ? null : cargo);
        };

        return (
          <Paper key={cargo} sx={{ p: 2, borderRadius: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onClick={handleHeaderClick}
              sx={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Radio
                  checked={isCardSelected}
                  onClick={handleRadioClick}
                  onFocus={(e) => e.stopPropagation()} 
                />
                <Typography fontWeight={600} textTransform="capitalize">
                  {cargo}
                </Typography>
                
                {isCardSelected && (
                  <Typography variant="caption" color="text.secondary">
                    {selectedProductIds.length} of {productIds.length} items selected
                  </Typography>
                )}
              </Box>
              {openCargo === cargo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={openCargo === cargo}>
              <Box mt={2} display="flex" flexDirection="column" gap={1}>
                {items.map((item) => (
                  <CartItemCard
                    key={item.product_id}
                    item={item}
                    isSelected={selectedProductIds.includes(item.product_id)}
                    selectedCurrency={currency}
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