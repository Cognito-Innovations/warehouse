import React from "react";
import { Box, Paper, Skeleton, Stack } from "@mui/material";

export default function ProductDetailTabsSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Stack direction="row" spacing={4}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', height: 64 }}>
              <Skeleton 
                variant="text" 
                width={80 + Math.random() * 40}
                height={24} 
              />
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Stack spacing={1.5}>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
          
          <Skeleton variant="text" width="95%" height={20} />
          <Skeleton variant="text" width="92%" height={20} />
          <Skeleton variant="text" width="98%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </Stack>
      </Box>
    </Paper>
  );
}