import React from "react";
import { Box, Typography, Container } from "@mui/material";

export const AssistedShoppingHero = () => {
  return (
    <Box 
      sx={{ 
        bgcolor: "primary.main", 
        py: { xs: 5, sm: 6, md: 6 }, 
        px: { xs: 2, sm: 3 }, 
        textAlign: "center", 
        color: "white",
        width: "100%"
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          sx={{ 
            mb: 2, 
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            lineHeight: 1.2
          }}
        >
          Buying Assistant
        </Typography>
        <Typography 
          variant="h6" 
          fontWeight={400} 
          sx={{ 
            mb: 1, 
            fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
            lineHeight: 1.5
          }}
        >
          Found something you love at a store?
        </Typography>
        <Typography 
          variant="h6" 
          fontWeight={400} 
          sx={{ 
            mb: 3, 
            fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
            lineHeight: 1.5
          }}
        >
          Let us buy it for you!
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.95, 
            maxWidth: "700px", 
            mx: "auto",
            fontSize: { xs: "0.8125rem", md: "0.875rem" },
            lineHeight: 1.6
          }}
        >
          Choose a virtual address or paste a product link below to get started.
        </Typography>
      </Container>
    </Box>
  );
};