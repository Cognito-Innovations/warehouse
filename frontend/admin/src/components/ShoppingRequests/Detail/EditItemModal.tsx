import { Box, TextField, Button, Checkbox, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import { numberInputStyle } from "../../../styles/numberInputStyle";

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  unitPriceInitial: number;
  availableInitial: boolean;
  onSave: (data: { unit_price: number; available: boolean }) => void | Promise<void>;
}

const EditItemModal = ({ open, onClose, unitPriceInitial, availableInitial, onSave }: EditItemModalProps) => {
  const [unitPrice, setUnitPrice] = useState(unitPriceInitial);
  const [available, setAvailable] = useState(availableInitial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUnitPrice(unitPriceInitial);
    setAvailable(availableInitial);
  }, [unitPriceInitial, availableInitial]);

  const handleUnitPriceChange = (value: string) => {
    if (value === "") {
      setUnitPrice(0);
      setError("Unit Price is mandatory");
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 999999.99) {
      setUnitPrice(num);
      if (num > 0) setError("");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave({ unit_price: unitPrice, available });
      onClose();
    } catch (err) {
      console.error("Failed to save item", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Item/Link">
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Unit Price"
          type="number"
          value={unitPrice}
          onChange={(e) => handleUnitPriceChange(e.target.value)}
          fullWidth
          size="small"
          required
          error={Boolean(error)}
          helperText={error || "Unit price in dollar($)"}
          inputProps={{
            min: 0,
            max: 999999.99,
            step: "0.01",
            maxLength: 9,
          }}
          sx={numberInputStyle}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox checked={available} onChange={(e) => setAvailable(e.target.checked)} />
          <Typography>Available?</Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Modal>
  );
};

export default EditItemModal;
