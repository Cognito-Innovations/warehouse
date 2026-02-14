import React from "react";
import { Box, Card, CircularProgress, IconButton, Typography } from "@mui/material";
import { Edit as EditIcon, DeleteOutline as DeleteIcon } from "@mui/icons-material";
import type { BoxItem } from "../../types";

interface BoxCardProps {
  box: BoxItem;
  index: number;
  total: number;
  onEdit: (boxId: string, displayLabel: string) => void;
  onDelete: (boxId: string) => void;
  onSelect: () => void;
  selected: boolean;
  isDeleting?: boolean;
  isDeparted: boolean;
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
  isDeparted,
}) => {
  const displayLabel =
    box.label || (total === 1 ? "Box 1" : `Box ${index + 1}`);

  return (
    <Card
      variant="outlined"
      onClick={onSelect}
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
            {parseFloat(String(box.length_cm)) || 0} x {parseFloat(String(box.breadth_cm)) || 0} x {parseFloat(String(box.height_cm)) || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gross Weight: {parseFloat(String(box.volumetric_weight)) ?? "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mass Weight: {parseFloat(String(box.mass_weight)) ?? "-"}
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
            disabled={isDeparted}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ bgcolor: "#fee2e2", color: "#ef4444" }}
            onClick={() => onDelete(box.id)}
            disabled={isDeleting || isDeparted}
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