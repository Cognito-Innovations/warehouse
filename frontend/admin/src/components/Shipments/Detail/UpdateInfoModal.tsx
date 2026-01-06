import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  CircularProgress,
} from "@mui/material";
import WeightSection from "./WeightSection";
import { updateShipment } from "../../../services/api.services";
import type { Pieces } from "./ShipmentDetailsSection";

interface PieceData {
  weight: string;
  length: string;
  width: string;
  height: string;
  volumetricWeight: string;
}

interface FormData {
  customsValue: string;
  pieces: PieceData[];
}

interface Shipment {
  id: string;
  customs_value: string;
  pieces: Pieces[];
  total_weight: string | number;
  total_volumetric_weight: string | number;
  length: string | number | null;
  width: string | number | null;
  height: string | number | null;
}

interface UpdateInfoModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  shipments: Shipment;
}

const getInitialFormData = (shipmentData: Shipment): FormData => {
  const parseNum = (val: string | number | null | undefined): number => {
    return parseFloat(String(val || '0')) || 0;
  };

  const l = parseNum(shipmentData.length);
  const w = parseNum(shipmentData.width);
  const h = parseNum(shipmentData.height);
  const initialVolumetricWeight = (l * w * h) / 5000;

  const volWeightNum = parseNum(shipmentData.total_volumetric_weight);
  const volWeight = volWeightNum > 0 ? volWeightNum : initialVolumetricWeight;

  let pieces: PieceData[] = [
    {
      weight: String(parseNum(shipmentData.total_weight)),
      length: String(l),
      width: String(w),
      height: String(h),
      volumetricWeight: volWeight > 0 ? volWeight.toFixed(3) : "0.000",
    },
  ];

  if (shipmentData.pieces && shipmentData.pieces.length > 0) {
    pieces = shipmentData.pieces.map((p: any) => ({
      weight: String(parseNum(p.weight)),
      length: String(parseNum(p.length)),
      width: String(parseNum(p.width)),
      height: String(parseNum(p.height)),
      volumetricWeight: String(parseNum(p.volumetric_weight)),
    }));
  }

  return {
    customsValue: String(shipmentData.customs_value || "0.00"),
    pieces,
  };
};

const UpdateInfoModal: React.FC<UpdateInfoModalProps> = ({
  open,
  onClose,
  onRefresh,
  shipments,
}) => {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [initialFormData, setInitialFormData] = useState<FormData>(() =>
    getInitialFormData(shipments)
  );
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (open) {
      const newInitialData = getInitialFormData(shipments);
      setInitialFormData(newInitialData);
      setFormData(newInitialData);
      setErrors({});
    }
  }, [shipments, open]);

  const handleCustomsValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const validValue = value.replace(/[^0-9.]/g, "");

    setFormData((prev) => ({
      ...prev,
      customsValue: validValue,
    }));

    if (errors.customsValue) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customsValue;
        return newErrors;
      });
    }
  };

  const handleAddPiece = () => {
    setFormData((prev) => ({
      ...prev,
      pieces: [
        ...prev.pieces,
        { weight: "0", length: "0", width: "0", height: "0", volumetricWeight: "0.000" },
      ],
    }));
  };

  const handleRemovePiece = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pieces: prev.pieces.filter((_, i) => i !== index),
    }));
  };

  const handlePieceChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedPieces = [...prev.pieces];
      const pieceToUpdate = { ...updatedPieces[index] };
      pieceToUpdate[field as keyof PieceData] = value;

      const { length, width, height } = pieceToUpdate;
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      const h = parseFloat(height) || 0;

      if (l > 0 && w > 0 && h > 0) {
        const volWeight = (l * w * h) / 5000;
        pieceToUpdate.volumetricWeight = volWeight.toFixed(3);
      } else {
        pieceToUpdate.volumetricWeight = "0.000";
      }

      updatedPieces[index] = pieceToUpdate;
      return { ...prev, pieces: updatedPieces };
    });

    const errorKey = `piece_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const { totalWeight, totalVolWeight } = useMemo(() => {
    let tw = 0;
    let tvw = 0;
    formData.pieces.forEach((p) => {
      tw += parseFloat(p.weight) || 0;
      tvw += parseFloat(p.volumetricWeight) || 0;
    });
    return {
      totalWeight: tw.toFixed(3),
      totalVolWeight: tvw.toFixed(3),
    };
  }, [formData.pieces]);

  const calculateTotalsForProps = () => ({ totalWeight, totalVolWeight });

  const isFormChanged = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  const isFormValid = useMemo(() => {
    if (!formData.customsValue || parseFloat(formData.customsValue) <= 0) {
      return false;
    }
    if (formData.pieces.length === 0) {
      return false;
    }
    return formData.pieces.every((p) => {
      const weightValid = p.weight && parseFloat(p.weight) > 0;

      const l = parseFloat(p.length) || 0;
      const w = parseFloat(p.width) || 0;
      const h = parseFloat(p.height) || 0;

      const anyVolProvided = l > 0 || w > 0 || h > 0;
      const allVolProvided = l > 0 && w > 0 && h > 0;

      return weightValid && (!anyVolProvided || allVolProvided);
    }
    );
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    const customsValNum = parseFloat(formData.customsValue);
    if (!formData.customsValue || isNaN(customsValNum) || customsValNum <= 0) {
      newErrors.customsValue = "Customs value must be a number greater than 0";
      isValid = false;
    }

    if (formData.pieces.length === 0) {
      newErrors.weight = "At least one piece is required";
      isValid = false;
    }

    formData.pieces.forEach((piece, idx) => {
      if (!piece.weight || parseFloat(piece.weight) <= 0) {
        newErrors[`piece_${idx}_weight`] = "Required > 0";
        isValid = false;
      }

      const l = parseFloat(piece.length) || 0;
      const w = parseFloat(piece.width) || 0;
      const h = parseFloat(piece.height) || 0;

      const anyVolProvided = l > 0 || w > 0 || h > 0;
      const allVolProvided = l > 0 && w > 0 && h > 0;

      if (anyVolProvided && !allVolProvided) {
        if (l <= 0) {
          newErrors[`piece_${idx}_length`] = "Required when using volumetric weight";
        }
        if (w <= 0) {
          newErrors[`piece_${idx}_width`] = "Required when using volumetric weight";
        }
        if (h <= 0) {
          newErrors[`piece_${idx}_height`] = "Required when using volumetric weight";
        }
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!isFormChanged) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const piecesPayload = formData.pieces.map((piece, index) => ({
        piece_number: index + 1,
        weight: parseFloat(piece.weight),
        length: parseFloat(piece.length),
        width: parseFloat(piece.width),
        height: parseFloat(piece.height),
        volumetric_weight: parseFloat(piece.volumetricWeight),
      }));

      const payload = {
        customs_value: parseFloat(formData.customsValue),
        pieces: piecesPayload,
      };

      await updateShipment(shipments.id, payload);
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to update package", err);
      setErrors({ general: "Failed to update shipment. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "#1e293b" }}>
        Update Package Information
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Shipping Modes
            </Typography>
            <RadioGroup value="Air">
              <FormControlLabel
                value="Air"
                control={
                  <Radio
                    sx={{
                      color: "#f50057",
                      "&.Mui-checked": { color: "#f50057" },
                    }}
                  />
                }
                label="Air"
              />
            </RadioGroup>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Carriers</Typography>
            <RadioGroup value="REDBOX">
              <FormControlLabel
                value="REDBOX"
                control={
                  <Radio
                    sx={{
                      color: "#f50057",
                      "&.Mui-checked": { color: "#f50057" },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      REDBOX
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5 to 10 Business days from the day of departure
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Box>

          <TextField
            fullWidth
            label="Customs Value (USD)"
            value={formData.customsValue}
            onChange={handleCustomsValueChange}
            variant="outlined"
            sx={{ mb: 3 }}
            error={!!errors.customsValue}
            helperText={errors.customsValue || ""}
            type="text"
            inputProps={{ inputMode: "decimal" }}
          />

          <WeightSection
            pieces={formData.pieces}
            onPieceChange={handlePieceChange}
            onAddPiece={handleAddPiece}
            onRemovePiece={handleRemovePiece}
            calculateTotals={calculateTotalsForProps}
            errors={errors}
          />

          {errors.general && (
            <Typography variant="caption" color="error" sx={{ mt: 2, display: "block" }}>
              {errors.general}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || !isFormValid || !isFormChanged}
          sx={{
            bgcolor: "#3b82f6",
            "&:hover": { bgcolor: "#2563eb" },
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&.Mui-disabled": {
              backgroundColor: "#94a3b8",
              color: "#e2e8f0",
            },
          }}
        >
          {saving ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateInfoModal;