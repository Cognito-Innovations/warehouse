import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import useCategoryStore from "@/store/categoryStore";
import { DEFAULT_IMG } from "@/utils/constants";

const CategoryItems = () => {
  const router = useRouter();
  const { categories, selectedCategory, handleCategorySelect } = useCategoryStore();

  return (
    <>
      {categories?.map((category: any) => {
        const isActive = selectedCategory === category.slug;

        return (
          <Box
            key={`category-${category.slug}`}
            onClick={() => {
              handleCategorySelect(category.slug);
              router.push(`/ecommerce/category/${category.slug}`);
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { transform: "translateY(-2px)" },
              minWidth: { xs: "80px", sm: "100px", md: "120px" },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 44, sm: 52, md: 60 },
                height: { xs: 44, sm: 52, md: 60 },
                borderRadius: 2.5,
                bgcolor: isActive ? "#d5c4ff" : "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
                boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
                transition: "0.2s",
                overflow: "hidden",
              }}
            >
              <img
                src={category.image_url || DEFAULT_IMG}
                onError={(e) => (e.currentTarget.src = DEFAULT_IMG)}
                alt={category.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontWeight: isActive ? 700 : 500,
                color: "#333",
                textAlign: "center",
              }}
            >
              {category.name}
            </Typography>

            {isActive && (
              <Box sx={{ width: "110%", height: 4, bgcolor: "#d5c4ff", borderRadius: 2, mt: 0.5 }} />
            )}
          </Box>
        );
      })}
    </>
  );
};

export default CategoryItems;
