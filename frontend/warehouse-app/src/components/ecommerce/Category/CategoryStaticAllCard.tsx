import { Box, Typography } from "@mui/material";

import useCategoryStore from "@/store/categoryStore";
import GridViewIcon from "@mui/icons-material/GridView";
import { TW_COLORS } from "@/utils/colors";

const CategoryStaticAllCard = () => {
    const iconBgColor = TW_COLORS.primary;
    const { selectedCategory, handleCategorySelect } = useCategoryStore();
    const isAllActive = !selectedCategory;

    return(
        <Box
          onClick={() => handleCategorySelect(null)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "transform 0.2 ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
            },
            minWidth: { xs: "80px", sm: "100px", md: "120px" },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: { xs: 44, sm: 52, md: 60 },
              height: { xs: 44, sm: 52, md: 60 },
              borderRadius: 2.5,
              bgcolor: isAllActive ? iconBgColor : "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              boxShadow: isAllActive ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
              transition: "all 0.2s ease-in-out",
              overflow: "hidden",
            }}
          >
            <GridViewIcon
              sx={{
                fontSize: { xs: 24, sm: 28, md: 32 },
                color: isAllActive ? "white" : iconBgColor,
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: isAllActive ? 700 : 500,
              color: "#333",
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              textAlign: "center",
              mb: 0.5,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            All
          </Typography>

          {isAllActive && (
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

export default CategoryStaticAllCard;