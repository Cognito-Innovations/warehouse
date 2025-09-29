"use client";

import { Box, Button, TextField, Typography, Link, Divider, Alert, Snackbar, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { generateSequentialSuiteNumber } from "../../utils/auth.utils";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordStrength from "./PasswordStrength";

export default function SignInForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const buttonStyles = { py: 1.5, textTransform: "none", borderRadius: "6px" };
  
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const passwordValidation = useMemo(() => {
    const pass = password;
    return {
      length: pass.length >= 6,
      uppercase: /[A-Z]/.test(pass),
      lowercase: (pass.match(/[a-z]/g) || []).length >= 2,
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass),
    };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      const isPasswordValid = Object.values(passwordValidation).every(v => v);
      if (!isPasswordValid) {
        setError("Please meet all password requirements.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Use NextAuth credentials provider for login
        const result = await signIn("credentials", {
          email,
          password: password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        // For registration, call backend directly then sign in
        const suiteNumber = generateSequentialSuiteNumber();
        
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/auth/register`, {
          email,
          password: password,
          name,
          suite_no: suiteNumber,
        });

        if (response.data.access_token) {
          // After successful registration, sign in with credentials
          const result = await signIn("credentials", {
            email,
            password: password,
            redirect: false,
          });

          if (result?.ok) {
            router.push("/dashboard");
          } else {
            setError("Registration successful but login failed. Please try logging in.");
          }
        } else {
          setError(response.data.message || "Registration failed");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    signIn("google", {
      callbackUrl: "https://warehouse-app-henna.vercel.app/dashboard",
    });
  };

  // Show loading while checking authentication status
  if (authLoading) {
    return (
      <Box sx={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 380, overflow: "visible" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <img
          src="/palakart-text-logo.png"
          alt="Palakart Logo"
          style={{ maxWidth: "200px", height: "auto", margin:10 }}
        />
      </Box>

      <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
        {isLogin ? "Sign in to your account" : "Create your account"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        )}
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        
        <Box sx={{ position: "relative" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            disabled={loading}
            InputProps={{
              endAdornment: (
              <InputAdornment position="end">
                  <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
              </InputAdornment>
              ),
            }}
          />
          {isPasswordFocused && password && (
            <PasswordStrength password_str={password} />
          )}
        </Box>

        {isLogin && (
          <Link
            href="#"
            variant="body2"
            sx={{ display: "block", textAlign: "right", mt: 1, color: "#6D28D9", textDecoration: "none" }}
          >
            Forgot your password?
          </Link>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ ...buttonStyles, mt: 3, mb: 1, bgcolor: "#6D28D9", "&:hover": { bgcolor: "#5B21B6" } }}
        >
          {loading ? "Please wait..." : (isLogin ? "Sign in" : "Register")}
        </Button>
      </form>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => setIsLogin(!isLogin)}
        disabled={loading}
        sx={{
          ...buttonStyles,
          mb: 2,
          borderColor: "#E5E7EB",
          color: "#4B5563",
          "&:hover": { bgcolor: "#F9FAFB" }
        }}
      >
        {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
      </Button>

      <Divider sx={{ my: 2, color: "#6B7280" }}>Or continue with</Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<img src="/google-icon.svg" alt="Google" style={{ width: 20, height: 20 }} />}
        onClick={handleGoogleSignIn}
        disabled={loading}
        sx={{
          ...buttonStyles,
          borderColor: "#E5E7EB",
          color: "#4B5563",
          "&:hover": { bgcolor: "#F9FAFB" }
        }}
      >
        Sign in with Google
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}