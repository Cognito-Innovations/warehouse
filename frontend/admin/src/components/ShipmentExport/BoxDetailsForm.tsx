import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { numberInputStyle } from "../../styles/numberInputStyle";

interface BoxDetailsValues {
  label: string;
  length: string;
  breadth: string;
  height: string;
  volumetricWeight: string;
  massWeight: string;
}

interface BoxDetailsFormProps {
  initialValues?: {
    label: string;
    length: string;
    breadth: string;
    height: string;
    volumetricWeight: string;
    massWeight: string;
  };
  onSave: (values: BoxDetailsValues) => Promise<void>;
}

const BoxDetailsForm: React.FC<BoxDetailsFormProps> = ({
  initialValues,
  onSave,
}) => {
  const [label, setLabel] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [volumetricWeight, setVolumetricWeight] = useState("");
  const [massWeight, setMassWeight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setLabel(initialValues.label || "");
      setLength(initialValues.length || "");
      setBreadth(initialValues.breadth || "");
      setHeight(initialValues.height || "");
      setVolumetricWeight(initialValues.volumetricWeight || "");
      setMassWeight(initialValues.massWeight || "");
    }
  }, [initialValues]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!label || !length || !breadth || !height || !volumetricWeight || !massWeight) return;

    try {
      setLoading(true);
      await onSave({ label, length, breadth, height, volumetricWeight, massWeight });
    } catch (err) {
      console.error("Failed to save box:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
      {/* Row 1 - Label full width */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
          required
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Row 2 - Length, Breadth, Height */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Length (CM)"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          required
          size="small"
          type="number"
          fullWidth
          variant="outlined"
          sx={numberInputStyle}
        />
        <TextField
          label="Breadth (CM)"
          value={breadth}
          onChange={(e) => setBreadth(e.target.value)}
          required
          size="small"
          type="number"
          fullWidth
          variant="outlined"
          sx={numberInputStyle}
        />
        <TextField
          label="Height (CM)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
          size="small"
          type="number"
          fullWidth
          variant="outlined"
          sx={numberInputStyle}
        />
      </Box>

      {/* Row 3 - Volumetric Weight + Mass Weight */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Volumetric Weight (KG)"
          value={volumetricWeight}
          onChange={(e) => setVolumetricWeight(e.target.value)}
          required
          size="small"
          type="number"
          fullWidth
          variant="outlined"
          sx={numberInputStyle}
        />
        <TextField
          label="Mass Weight (KG)"
          value={massWeight}
          onChange={(e) => setMassWeight(e.target.value)}
          required
          size="small"
          type="number"
          fullWidth
          variant="outlined"
          sx={numberInputStyle}
        />
      </Box>

      {/* Row 4 - Save button (bottom-right aligned) */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={
            loading || !label || !length || !breadth || !height || !volumetricWeight || !massWeight
          }
          sx={{
            textTransform: "none",
            borderRadius: "6px",
            bgcolor: "#7c3aed",
            "&:hover": { bgcolor: "#6d28d9" },
            px: 3,
            py: 1,
            fontWeight: 500,
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default BoxDetailsForm;
