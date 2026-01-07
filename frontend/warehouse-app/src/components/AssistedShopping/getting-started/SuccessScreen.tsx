import React from "react";
import { Box, Typography, Fade, Link } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ROUTES } from "@/utils/constants";

export default function SuccessScreen() {
  return (
    <Fade in={true} timeout={600}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          maxWidth: { xs: "90%", md: "600px" },
          mx: "auto",
          px: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            mb: 3,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: { xs: 80, md: 100 }, color: "success.main" }} />
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: "bold", 
            mb: 1, 
            color: "text.primary",
            fontSize: { xs: "1.5rem", md: "2rem" }
          }}
        >
          Success!
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "medium", 
            mb: 2, 
            color: "text.primary",
            fontSize: { xs: "1.125rem", md: "1.25rem" }
          }}
        >
          Your Shopping Request Has Been Submitted
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "text.secondary",
            maxWidth: "80%",
            fontSize: { xs: "0.875rem", md: "1rem" }
          }}
        >
          Thank you! Our team will process your request shortly. You'll receive an update soon.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "text.secondary",
            mt: 2,
            fontSize: { xs: "0.875rem", md: "1rem" }
          }}
        >
          To see all the shopping requests, <Link href={ROUTES.ASSISTED_SHOPPING_HISTORY} underline="hover">click here</Link>.
        </Typography>
      </Box>
    </Fade>
  );
}