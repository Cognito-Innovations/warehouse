"use client";
import { Box, Skeleton } from "@mui/material";

interface Props {
  count?: number;
}

export default function CategoryNavSkeleton({ count = 8 }: Props) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: { xs: "80px", sm: "100px", md: "120px" },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: { xs: 44, sm: 52, md: 60 },
              height: { xs: 44, sm: 52, md: 60 },
              borderRadius: 2.5,
              bgcolor: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              boxShadow: "none",
            }}
          >
            <Skeleton variant="circular" width="70%" height="70%" />
          </Box>

          <Skeleton
            variant="text"
            width={index === 0 ? 30 : 80}
            height={16}
          />
        </Box>
      ))}
    </>
  );
}
