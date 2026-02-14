import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { createShipmentExportBox } from "../../services/api.services";

interface AddNewBoxButtonProps {
  shipmentId: string;
  onBoxAdded: () => void;
  isDeparted: boolean;
  hasBoxes: boolean;
}

const AddNewBoxButton: React.FC<AddNewBoxButtonProps> = ({
  shipmentId,
  onBoxAdded,
  isDeparted,
  hasBoxes,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddBox = async () => {
    if (isDeparted) return;

    setIsAdding(true);
    try {
      await createShipmentExportBox(shipmentId, {
        length_cm: 0,
        breadth_cm: 0,
        height_cm: 0,
        volumetric_weight: 0,
        mass_weight: 0,
      });

      onBoxAdded();
    } catch (error) {
      console.error("Failed to create box:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant="contained"
      disabled={isAdding || isDeparted}
      startIcon={
        isAdding ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <AddIcon />
        )
      }
      sx={{
        textTransform: "none",
        borderRadius: 2,
        boxShadow: "none",
        alignSelf: "flex-start",
        mt: hasBoxes ? 2 : 0,
      }}
      onClick={handleAddBox}
    >
      {isAdding ? "Adding..." : "Add New Box"}
    </Button>
  );
};

export default AddNewBoxButton;