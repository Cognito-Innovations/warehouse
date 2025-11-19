"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { toast } from "sonner";
import { updatePassword } from "@/lib/api.service";
import { useAuth } from "@/contexts/AuthContext";

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function PasswordPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));

    if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    let tempErrors: FormErrors = {};

    if (!formData.currentPassword) {
      tempErrors.currentPassword = "Current password is required.";
    }
    if (!formData.newPassword) {
      tempErrors.newPassword = "New password is required.";
    }
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your new password.";
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      tempErrors.newPassword = "Password must be at least 6 characters long.";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      tempErrors.confirmPassword = "New password and confirm password do not match.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      console.log("Validation failed", errors);
      return;
    }

    try {
      await updatePassword(user?.id!, formData.currentPassword, formData.newPassword);
      toast.success("Password updated successfully");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update password";
      toast.error(errorMessage);
      
      setErrors({ currentPassword: errorMessage });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: "grey.900", mb: 2 }}>
        Change Password
      </Typography>
      
      <Typography variant="body2" sx={{ color: "grey.600", mb: 2 }}>
        Update your password to keep your account secure.
      </Typography>

      <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange("currentPassword")}
              fullWidth
              size="medium"
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            
            <TextField
              required
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              fullWidth
              size="medium"
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            
            <TextField
              required
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              fullWidth
              size="medium"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                type="submit"
                size="small"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  textTransform: "none",
                  borderRadius: "6px",
                  px: 3,
                  py: 0.5,
                  fontSize: "0.875rem",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}