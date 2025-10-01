"use client";

import { useSession } from "next-auth/react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Typography, Paper, Button } from "@mui/material";

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const { user, loading } = useAuth();

  return (
    <Paper sx={{ p: 2, m: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Debug Authentication Status
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">NextAuth Session Status:</Typography>
        <Typography variant="body2" color="text.secondary">
          {status}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">NextAuth Session Data:</Typography>
        <pre style={{ fontSize: "12px", overflow: "auto", maxHeight: "200px" }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">AuthContext User:</Typography>
        <pre style={{ fontSize: "12px", overflow: "auto", maxHeight: "200px" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">AuthContext Loading:</Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? "true" : "false"}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Current URL:</Typography>
        <Typography variant="body2" color="text.secondary">
          {typeof window !== "undefined" ? window.location.href : "SSR"}
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        onClick={() => window.location.reload()}
        sx={{ mr: 1 }}
      >
        Reload Page
      </Button>

      <Button 
        variant="outlined" 
        onClick={() => {
          console.log("Session:", session);
          console.log("User:", user);
          console.log("Status:", status);
          console.log("Loading:", loading);
        }}
      >
        Log to Console
      </Button>
    </Paper>
  );
}
