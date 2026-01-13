"use client";

import { Box, Button, Typography, Alert, Snackbar, CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "@/utils/constants";

interface SignInFormProps {
  callbackUrl?: string;
}

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const { loading: authLoading } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = callbackUrl || ROUTES.DASHBOARD;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("google", {
        callbackUrl: redirectTo,
        redirect: false
      });
      
      if (result?.url) {
        // Force a page reload to ensure session is properly set
        window.location.href = result.url;
      } else if (result?.error) {
        console.error("Google sign-in error:", result.error);
        setError("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication status
  if (authLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        px: { xs: 2, sm: 0 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box 
        sx={{ 
          mb: 1, 
          display: "flex", 
          justifyContent: "center", 
          width: "100%",
          bgcolor: "transparent"
        }}
      >
        <img
          src="/palakart-text-logo.png"
          alt="Palakart"
          style={{ 
            maxWidth: 200, 
            height: "auto", 
            display: "block",
            backgroundColor: "transparent"
          }}
        />
      </Box>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        align="center"
        sx={{ 
          mb: 5, 
          fontWeight: 500,
          width: "100%",
          lineHeight: 1.5
        }}
      >
        Sign in securely using your Google account
      </Typography>

      <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={handleGoogleSignIn}
        disabled={loading}
        startIcon={
          <Box
            component="img"
            src="/google-icon.svg"
            alt="Google"
            sx={{ width: 20, height: 20, mr: 1 }}
          />
        }
        sx={{
          py: 1.8,
          borderRadius: "12px",
          borderColor: "#E0E0E0",
          color: "#1F2937",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          backgroundColor: "#fff",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.02)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            bgcolor: "#F9FAFB",
            borderColor: "#D1D5DB",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.05)",
          },
        }}
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </Button>

      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        sx={{ 
          mt: 5, 
          display: "block", 
          maxWidth: "90%",
          lineHeight: 1.6 
        }}
      >
        By continuing, you agree to Palakart’s Terms & Privacy Policy
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError("")} sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}