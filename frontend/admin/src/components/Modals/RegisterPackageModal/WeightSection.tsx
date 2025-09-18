import React from 'react';
import { Grid, Box, Typography, TextField, Button, IconButton, Tooltip } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { XCircle } from 'lucide-react';

interface Piece {
  weight: string;
  length: string;
  width: string;
  height: string;
  volumetricWeight: string;
}

interface WeightSectionProps {
  pieces: Piece[];
  onPieceChange: (index: number, field: string, value: string) => void;
  onAddPiece: () => void;
  onRemovePiece: (index: number) => void;
  calculateTotals: () => { totalWeight: string; totalVolWeight: string };
  errors: { [key: string]: string };
}

const handleNumericChange = (
  value: string,
  maxDigitsBeforeDecimal: number,
  maxDigitsAfterDecimal: number,
  callback: (validatedValue: string) => void
) => {
  let validatedValue = value.replace(/[^0-9.]/g, '');
  const parts = validatedValue.split('.');

  if (parts.length > 2) {
    validatedValue = parts[0] + '.' + parts.slice(1).join('');
  }
  
  const [integerPart, decimalPart] = validatedValue.split('.');

  const truncatedIntegerPart = integerPart.slice(0, maxDigitsBeforeDecimal);
  let truncatedDecimalPart = decimalPart;
  if (decimalPart) {
    truncatedDecimalPart = decimalPart.slice(0, maxDigitsAfterDecimal);
  }

  if (truncatedDecimalPart !== undefined) {
    validatedValue = truncatedIntegerPart + '.' + truncatedDecimalPart;
  } else {
    validatedValue = truncatedIntegerPart;
  }
  
  callback(validatedValue);
};

const WeightSection: React.FC<WeightSectionProps> = ({
  pieces,
  onPieceChange,
  onAddPiece,
  onRemovePiece,
  calculateTotals,
  errors,
}) => {
  const { totalWeight, totalVolWeight } = calculateTotals();

  return (
    <Grid size={{ xs: 12 }}>
      <Box sx={{ border: "1px solid #c4c4c4", borderRadius: "4px", p: 2 }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
          Piece(s) Actual Weight and Volumetric Weight
        </Typography>
        <Box sx={{ display: "flex", gap: 15, mb: -1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Actual Weight
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Volumetric Weight
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
          {pieces.map((piece, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 0, position: "relative" }}>
              {/* Remove button for multiple pieces */}
              {pieces.length > 1 && (
                <IconButton size="medium" onClick={() => onRemovePiece(idx)} sx={{
                  position: "absolute",
                  bottom: 25,
                  right: -1,
                  zIndex: 1,
                }}>
                  <XCircle width={"20px"} height={"20px"} color="#ef4444" />
                </IconButton>
              )}

              {/* Actual Weight Section */}
              <Box
                sx={{
                  borderTop: "0.2px solid #c4c4c4",
                  borderBottom: "0.2px solid #c4c4c4",
                  borderRight: "0.2px solid #c4c4c4",
                  p: 2,
                  bgcolor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {idx + 1}.
                </Typography>
                <TextField
                  placeholder="Weight (KG)"
                  value={piece.weight || ""}
                  onChange={(e) => 
                    handleNumericChange(e.target.value, 7, 3, (val) => 
                      onPieceChange(idx, "weight", val)
                    )
                  }
                  size="small"
                  error={!!errors[`piece_${idx}_weight`]}
                  helperText={errors[`piece_${idx}_weight`] || ""}
                  sx={{
                    width: "160px", "& .MuiInputBase-root": { height: "52px", "& input": { padding: "6px 8px" } },
                  }}
                />
              </Box>

              {/* Volumetric Weight Section */}
              <Box
                sx={{
                  borderTop: "0.5px solid #c4c4c4",
                  borderBottom: "0.5px solid #c4c4c4",
                  p: 2,
                  bgcolor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: 1,
                }}
              >
                <TextField
                  placeholder="Length (CM)"
                  value={piece.length || ""}
                  onChange={(e) => 
                    handleNumericChange(e.target.value, 6, 2, (val) => 
                      onPieceChange(idx, "length", val)
                    )
                  }
                  size="small"
                  error={!!errors[`piece_${idx}_length`]}
                  helperText={errors[`piece_${idx}_length`] || ""}
                  sx={{
                    width: "160px", "& .MuiInputBase-root": { height: "52px", "& input": { padding: "6px 8px" } },
                  }}
                />
                <TextField
                  placeholder="Width (CM)"
                  value={piece.width || ""}
                  onChange={(e) => 
                    handleNumericChange(e.target.value, 6, 2, (val) => 
                      onPieceChange(idx, "width", val)
                    )
                  }
                  size="small"
                  error={!!errors[`piece_${idx}_width`]}
                  helperText={errors[`piece_${idx}_width`] || ""}
                  sx={{
                    width: "160px", "& .MuiInputBase-root": { height: "52px", "& input": { padding: "6px 8px" } },
                  }}
                />
                <TextField
                  placeholder="Height (CM)"
                  value={piece.height || ""}
                  onChange={(e) => 
                    handleNumericChange(e.target.value, 6, 2, (val) => 
                      onPieceChange(idx, "height", val)
                    )
                  }
                  size="small"
                  error={!!errors[`piece_${idx}_height`]}
                  helperText={errors[`piece_${idx}_height`] || ""}
                  sx={{ width: "160px", "& .MuiInputBase-root": { height: "52px", "& input": { padding: "6px 8px" } } }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#64758b", minWidth: "60px" }}>
                  Vol. Weight: {parseFloat(piece.volumetricWeight) > 0 ? `${parseFloat(piece.volumetricWeight).toFixed(3)} KG` : "-"}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Totals Section - Only show if multiple pieces or has data */}
        {(pieces.length > 0 && (parseFloat(totalWeight) > 0 || parseFloat(totalVolWeight) > 0)) && (
          <Box sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: 1,
            border: "1px solid #e2e8f0",
            mb: 2
          }}>
            <Box sx={{ display: "flex", gap: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Total Weight: {parseFloat(totalWeight).toFixed(3)} KG
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Total Vol. Weight: {parseFloat(totalVolWeight).toFixed(3)} KG
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={onAddPiece}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              bgcolor: "#8b5cf6",
              "&:hover": { bgcolor: "#7c3aed" },
            }}
          >
            Add New Piece
          </Button>
          <Tooltip title="Package received as more than one pieces, then add new piece by clicking add new piece and record weight and volumetric weight">
            <InfoIcon fontSize="small" />
          </Tooltip>
        </Box>
        
        {/* Weight Error Display */}
        {errors.weight && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            {errors.weight}
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

export default WeightSection;
