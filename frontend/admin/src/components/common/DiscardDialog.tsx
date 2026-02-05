import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress
} from "@mui/material";
import React, { useState, useEffect } from "react";

interface DiscardDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => Promise<void>;
  loading: boolean;
}

const DiscardDialog: React.FC<DiscardDialogProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
}) => {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(false);

  useEffect(() => {
    if (open) {
      setComment("");
      setCommentError(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!comment.trim()) {
      setCommentError(true);
      return;
    }
    await onConfirm(comment);
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>Discard Package</DialogTitle>

      <DialogContent>
        <p>
          Please provide a reason for discarding this package. This action cannot
          be undone.
        </p>

        <TextField
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setCommentError(false);
          }}
          error={commentError}
          helperText={commentError ? "Comment is required" : ""}
          fullWidth
          margin="normal"
          disabled={loading}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {loading ? "Discarding..." : "Discard"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscardDialog;
