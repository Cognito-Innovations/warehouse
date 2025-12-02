"use client";

import React from "react";
import { Box, Container, Typography, Button, AppBar, Toolbar, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

export default function EmptyCartState() {
  const router = useRouter();

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
          <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />

          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add some items to get started
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(ROUTES.ECOMMERCE)}
            sx={{
              bgcolor: "primary",
              textTransform: "none",
              px: 4,
              py: 1.5,
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

