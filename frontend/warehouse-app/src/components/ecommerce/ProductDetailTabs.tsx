"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import ProductDetailTabsSkeleton from "./skeleton-loader/ProductDetailTabsSkeleton";
import { EcommerceProduct } from "@/types/ecommerce";

interface ProductDetailTabsProps {
  product: EcommerceProduct;
  loading?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProductDetailTabs({ product, loading = false }: ProductDetailTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const shouldShowSkeleton = loading && !product.description;

  if (shouldShowSkeleton) {
    return <ProductDetailTabsSkeleton />;
  }

  return (
    <Paper elevation={0} sx={{ 
        mt: 4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value}
          onChange={handleChange}
          aria-label="product detail tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minHeight: 64,
              px: 3,
            },
            "& .Mui-selected": {
              color: "primary.main",
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Care Guide" />
        </Tabs>
      </Box>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
        <>
          <TabPanel value={value} index={0}>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}
            >
              {product.description || "No detailed description available for this product."}
            </Typography>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {product.category && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                    Category
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {product.category.name}
                  </Typography>
                </Box>
              )}
              {product.sub_category && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                    Sub Category
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {product.sub_category.name}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Unit Value
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {product.unit_value} {product.measurement?.label || ""}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Stock Quantity
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {product.stock_quantity ?? 0} units available
                </Typography>
              </Box>
              {product.country && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                    Country
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {product.country.name}
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Storage Instructions
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
                  Store in a cool, dry place. Keep away from direct sunlight and moisture. 
                  For best quality, consume before the expiry date.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Handling
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
                  Handle with care. Ensure proper packaging during transit. 
                  Check for any damage upon delivery.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Quality Assurance
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
                  All products are quality checked before dispatch. 
                  We guarantee fresh and authentic products delivered to your doorstep.
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={value} index={3}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to review this product!
              </Typography>
            </Box>
          </TabPanel>
        </>
      </Box>
    </Paper>
  );
}

