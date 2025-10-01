"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      sx: {
        borderRadius: "12px",
        maxWidth: "400px",
        padding: "16px",
        textAlign: "center"
      }
    }}>
      <DialogTitle sx={{ fontWeight: "bold", color: "purple.700" }}>{title}</DialogTitle>
      <DialogContent sx={{ color: "text.secondary", fontSize: "1rem", paddingBottom: "16px" }}>{message}</DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: "8px", paddingTop: "16px" }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading} sx={{
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          "&:hover": {
            backgroundColor: "action.hover"
          }
        }}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "error.dark"
            }
          }}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
