import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { updatePackageStatus } from "../../services/api.services";

interface UpdateToDepartedButtonProps {
  data: any;
  onRefresh: () => void;
}

const UpdateToDepartedButton: React.FC<UpdateToDepartedButtonProps> = ({ data, onRefresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateToDeparted = async () => {
    if (!data.id) return;
    try {
      setIsUpdating(true);
      await updatePackageStatus(data.id, "Departed");
      onRefresh?.();
    } catch (err) {
      console.error("Failed to update status to Departed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
      onClick={handleUpdateToDeparted}
      disabled={isUpdating}
      sx={{
          textTransform: 'none',
          bgcolor: "#a855f7",
          "&:hover": { bgcolor: "#9333ea" },
      }}
    >
      {isUpdating ? 'Updating...' : 'Update to Departed'}
    </Button>
  )
}

export default UpdateToDepartedButton;