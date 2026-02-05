"use client";

import { Dialog, Box, Typography, CircularProgress } from "@mui/material";

interface ProcessingPaymentDialogProps {
  open: boolean;
}

export const ProcessingPaymentDialog: React.FC<ProcessingPaymentDialogProps> = ({ open }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          borderRadius: 3,
          px: 4,
          py: 3,
          textAlign: "center",
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography fontWeight={600}>
          Processing your payment…
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please don’t close or refresh this page
        </Typography>
      </Box>
    </Dialog>
  );
};