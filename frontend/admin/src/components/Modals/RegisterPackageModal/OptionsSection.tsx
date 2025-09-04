import React from 'react';
import { Grid, Box, Typography, TextField, Checkbox, FormControlLabel } from '@mui/material';

interface OptionsSectionProps {
  formData: {
    allowCustomerItems: boolean;
    shopInvoiceReceived: boolean;
    remarks: string;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <>
      {/* Additional Options */}
      <Grid size={{ xs: 12 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FormControlLabel control={
            <Checkbox checked={formData.allowCustomerItems} onChange={(e) => onInputChange("allowCustomerItems", e.target.checked)}
              sx={{ "&.Mui-checked": { color: "#6366f1" } }} />
          }
            label="Allow customer to add items?"
            sx={{
              margin: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.shopInvoiceReceived}
                onChange={(e) =>
                  onInputChange("shopInvoiceReceived", e.target.checked)
                }
                sx={{
                  "&.Mui-checked": { color: "#6366f1" },
                }}
              />
            }
            label="Shop Invoice Received?"
            sx={{
              margin: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
          />
        </Box>
      </Grid>

      {/* Remarks */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Remarks
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Add remarks..."
          value={formData.remarks || ""}
          onChange={(e) => onInputChange("remarks", e.target.value)}
          sx={{
            "& .MuiInputBase-root": {
              minHeight: "60px",
            },
          }}
        />
      </Grid>
    </>
  );
};

export default OptionsSection;
