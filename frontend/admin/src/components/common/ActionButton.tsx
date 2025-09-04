import { Button } from "@mui/material";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  color?: "primary" | "danger";
  loading?: boolean;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  color = "primary",
  loading = false,
  disabled = false,
}) => {
  const styles =
    color === "primary"
      ? {
          backgroundColor: "#5856d6",
          "&:hover": { backgroundColor: "#4c4ab3" },
        }
      : {
          backgroundColor: "#e57373",
          "&:hover": { backgroundColor: "#ef5350" },
        };

  return (
    <Button
      variant="contained"
      disableElevation
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        ...styles,
        textTransform: "none",
        borderRadius: "8px",
        fontWeight: 600,
        px: 3,
      }}
    >
      {loading ? "Processing..." : label}
    </Button>
  );
};

export default ActionButton;