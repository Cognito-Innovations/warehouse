import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

interface BoxDetailsFormProps {
  initialValues?: {
    label: string;
    length: string;
    breadth: string;
    height: string;
    volumetricWeight: string;
    massWeight: string;
  };
  onSave: (values: any) => void;
}

const BoxDetailsForm: React.FC<BoxDetailsFormProps> = ({
  initialValues,
  onSave,
}) => {
  const [label, setLabel] = useState(initialValues?.label || "");
  const [length, setLength] = useState(initialValues?.length || "");
  const [breadth, setBreadth] = useState(initialValues?.breadth || "");
  const [height, setHeight] = useState(initialValues?.height || "");
  const [volumetricWeight, setVolumetricWeight] = useState(
    initialValues?.volumetricWeight || ""
  );
  const [massWeight, setMassWeight] = useState(initialValues?.massWeight || "");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!label || !length || !breadth || !height || !volumetricWeight || !massWeight) return;
    onSave({ label, length, breadth, height, volumetricWeight, massWeight });
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
        />
      </Box>

      {/* Row 4 - Save button (bottom-right aligned) */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={
            !label || !length || !breadth || !height || !volumetricWeight || !massWeight
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
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default BoxDetailsForm;
