"use client";

import React from "react";
import {
  Modal,
  Typography,
  Button,
  Paper,
  Fade,
  Backdrop,
  Stack,
} from "@mui/material";

interface OrderSuccessPopupProps {
  open: boolean;
  onContinueShopping: () => void;
}

export default function OrderSuccessPopup({
  open,
  onContinueShopping,
}: OrderSuccessPopupProps) {
  return (
    <Modal
      open={open}
      closeAfterTransition
      disableEscapeKeyDown
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 400,
          sx: { backgroundColor: "rgba(0,0,0,0.6)" },
        },
      }}
      onClose={(_, closeReason) => {
        if(closeReason === "backdropClick") return;
      }}
    >
      <Fade in={open}>
        <Paper sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 420 },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 30,
          p: 4,
          textAlign: "center",
        }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Order Placed Successfully 🎉
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Thank you for shopping with us! Your items will be delivered soon.
          </Typography>

          <Stack spacing={1.5}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={onContinueShopping}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Paper>
      </Fade>
    </Modal>
  );
}
