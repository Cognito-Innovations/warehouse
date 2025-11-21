import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

export default function CartLoginState() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Address
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        To select or add an address, please{" "}
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: "primary.main",
            cursor: "pointer",
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={handleLoginClick}
        >
          login
        </Typography>
        .
      </Typography>
    </Box>
  );
}