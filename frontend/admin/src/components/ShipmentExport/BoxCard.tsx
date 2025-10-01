import React from "react";
import { Box, Card, CircularProgress, IconButton, Typography } from "@mui/material";
import { Edit as EditIcon, DeleteOutline as DeleteIcon } from "@mui/icons-material";

interface BoxCardProps {
  box: {
    id: number;
    label?: string;
    length_cm: number;
    breadth_cm: number;
    height_cm: number;
    volumetric_weight?: number;
    mass_weight?: number;
  };
  index: number;
  total: number;
  onEdit: (boxId: number, displayLabel: string) => void;
  onDelete: (boxId: number) => void;
  onSelect: (boxId: number) => void;
  selected: boolean;
  isDeleting?: boolean;
}

const BoxCard: React.FC<BoxCardProps> = ({
  box,
  index,
  total,
  onEdit,
  onDelete,
  onSelect,
  selected,
  isDeleting,
}) => {
  const displayLabel =
    box.label || (total === 1 ? "Box 1" : `Box ${index + 1}`);

  return (
    <Card
      variant="outlined"
      onClick={() => onSelect(box.id)}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        cursor: "pointer",
        border: selected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
        "&:hover": { borderColor: "#3b82f6" },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography fontWeight={600}>{displayLabel}</Typography>
          <Typography variant="body2" color="text.secondary">
            Dimension (LxBxH):
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {parseFloat(box.length_cm as any) || 0} x {parseFloat(box.breadth_cm as any) || 0} x {parseFloat(box.height_cm as any) || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gross Weight: {parseFloat(box.volumetric_weight as any) ?? "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mass Weight: {parseFloat(box.mass_weight as any) ?? "-"}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", gap: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            sx={{ bgcolor: "#e0e7ff", color: "#4f46e5" }}
            onClick={() => onEdit(box.id, displayLabel)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ bgcolor: "#fee2e2", color: "#ef4444" }}
            onClick={() => onDelete(box.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default BoxCard;