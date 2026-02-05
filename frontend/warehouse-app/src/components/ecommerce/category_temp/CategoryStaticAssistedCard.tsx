import { Box, Typography } from "@mui/material";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import { TW_COLORS } from "@/utils/colors";

interface CategoryStaticAssistedCardProps {
  onClick: () => void;
  isSelected: boolean;
}

const CategoryStaticAssistedCard = ({ onClick, isSelected }: CategoryStaticAssistedCardProps) => {
  const iconBgColor = TW_COLORS.primary;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        minWidth: { xs: "140px", sm: "160px", md: "180px" },
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: { xs: 44, sm: 52, md: 60 },
          height: { xs: 44, sm: 52, md: 60 },
          borderRadius: 2.5,
          bgcolor: isSelected ? iconBgColor : "#ede9fe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
          boxShadow: isSelected ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
          transition: "all 0.2s ease-in-out",
          overflow: "hidden",
        }}
      >
        <ShoppingBag
          sx={{
            fontSize: { xs: 24, sm: 28, md: 32 },
            color: isSelected ? "white" : iconBgColor,
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          fontWeight: isSelected ? 700 : 500,
          color: "#333",
          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
          textAlign: "center",
          mb: 0.5,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Assisted Shopping
      </Typography>

      {isSelected && (
        <Box
          sx={{
            width: "110%",
            height: 4,
            bgcolor: iconBgColor,
            borderRadius: 2,
            mt: 0.5,
          }}
        />
      )}
    </Box>
  );
};

export default CategoryStaticAssistedCard;