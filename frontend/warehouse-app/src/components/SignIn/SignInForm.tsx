"use client";

import { Box, Button, TextField, Typography, Link, Divider } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const buttonStyles = { py: 1.5, textTransform: "none", borderRadius: "6px" };

  return (
    <Box sx={{ width: "100%", maxWidth: 380 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <img
          src="/logo.png"
          alt="Shopme Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Box>

      <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        Sign in to your account
      </Typography>

      <TextField margin="normal" required fullWidth label="Email / Suite No" variant="outlined" />
      <TextField margin="normal" required fullWidth name="password" label="Password" type="password" />

      <Link
        href="#"
        variant="body2"
        sx={{ display: "block", textAlign: "right", mt: 1, color: "#6D28D9", textDecoration: "none" }}
      >
        Forgot your password?
      </Link>

      <Button
        fullWidth
        variant="contained"
        sx={{ ...buttonStyles, mt: 3, mb: 1, bgcolor: "#6D28D9", "&:hover": { bgcolor: "#5B21B6" } }}
      >
        Sign in
      </Button>

      <Button
        fullWidth
        variant="outlined"
        sx={{
          ...buttonStyles,
          mb: 2,
          borderColor: "#E5E7EB",
          color: "#4B5563",
          "&:hover": { bgcolor: "#F9FAFB" }
        }}
      >
        Register
      </Button>

      <Divider sx={{ my: 2, color: "#6B7280" }}>Or continue with</Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<img src="/google-icon.svg" alt="Google" style={{ width: 20, height: 20 }} />}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        sx={{
          ...buttonStyles,
          borderColor: "#E5E7EB",
          color: "#4B5563",
          "&:hover": { bgcolor: "#F9FAFB" }
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}