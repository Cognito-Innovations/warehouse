"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Button,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { ROUTES } from "@/utils/constants";

interface OrderSuccessModalProps {
  open: boolean;
  onContinueShopping?: () => void;
  onViewOrders?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  open,
  onContinueShopping,
  onViewOrders,
}) => {
  const router = useRouter();
  const [isLoadingContinue, setIsLoadingContinue] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);

  const handleContinueShopping = () => {
    setIsLoadingContinue(true);
    router.push(ROUTES.ECOMMERCE);
    onContinueShopping?.();
  };

  const handleViewOrders = () => {
    setIsLoadingView(true);
    router.push(ROUTES.ORDER_HISTORY);
    onViewOrders?.();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      disableScrollLock={false}
      aria-labelledby="order-success-title"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: { xs: 2, sm: 3 },
          p: 0,
          m: { xs: 1, sm: 2 },
          maxWidth: { xs: "95vw", sm: 480 },
          width: "100%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e9ecef",
          bgcolor: "white",
        },
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        id="order-success-title"
        sx={{
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          borderBottom: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: { xs: 56, sm: 72, md: 80 },
              color: "success.main",
            }}
          />
          <Typography
            variant="h4"
            component="h2"
            fontWeight={700}
            color="text.primary"
            sx={{ 
              mb: { xs: 0.5, sm: 1 },
              fontSize: { xs: "1.5rem", sm: "2rem" }
            }}
          >
            Order Placed Successfully!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: "center",
              maxWidth: { xs: "280px", sm: 320 },
              lineHeight: 1.6,
              px: { xs: 1, sm: 0 },
            }}
          >
            Thank you for shopping with us! Your order has been confirmed and
            will be processed within 24 hours. You'll receive tracking updates
            soon.
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 }, pt: 0 }}>
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={{ xs: 1.5, sm: 2 }} 
          justifyContent="center"
        >
          <Button
            variant="outlined"
            size="large"
            onClick={handleContinueShopping}
            disabled={isLoadingContinue || isLoadingView}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: "auto" },
              borderRadius: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.95rem", sm: "1rem" },
              fontWeight: 600,
              textTransform: "none",
              borderColor: "primary.main",
              color: "primary.main",
              height: { xs: 48, sm: 56 },
              "&:hover": {
                borderColor: "primary.dark",
                bgcolor: "primary.50",
                color: "primary.dark",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)",
              },
              "&:disabled": {
                borderColor: "grey.300",
                color: "grey.500",
              }
            }}
          >
            {isLoadingContinue ? <CircularProgress size={20} color="primary" /> : "Continue Shopping"}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleViewOrders}
            disabled={isLoadingContinue || isLoadingView}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: "auto" },
              borderRadius: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.95rem", sm: "1rem" },
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              bgcolor: "primary.main",
              height: { xs: 48, sm: 56 },
              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              },
              "&:disabled": {
                bgcolor: "grey.400",
              }
            }}
          >
            {isLoadingView ? <CircularProgress size={20} color="inherit" /> : "View Orders"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};