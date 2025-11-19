import React from "react";
import { Button, CircularProgress, Stack } from "@mui/material";
import { Plus } from "lucide-react";

interface AddActionButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const AddActionButton: React.FC<AddActionButtonProps> = ({
  label,
  onClick,
  disabled = false,
  loading = false,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ mb: 2 }}
    >
      <Button
        variant="contained"
        startIcon={!loading ? <Plus size={18} /> : undefined}
        sx={{
          backgroundColor: "#5A48E8",
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "8px",
          px: 2.5,
          py: 1,
          minWidth: 140,
          "&:hover": {
            backgroundColor: "#4a3ed3",
          },
        }}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          label
        )}
      </Button>
    </Stack>
  );
};

export default AddActionButton;
