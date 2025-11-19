"use client";

import React from "react";
import { Box, Container, Typography, Button, AppBar, Toolbar, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { EmptyCartStateProps } from "@/types/ecommerce";

export default function EmptyCartState({
  icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonColor,
}: EmptyCartStateProps) {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => window.history.back()}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }} color="primary">
            My Cart
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          textAlign="center"
        >
          {icon}
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            onClick={onButtonClick}
            sx={{
              bgcolor: buttonColor,
              textTransform: "none",
              px: 4,
              py: 1.5,
            }}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

