"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  FormHelperText,
} from "@mui/material";
import { sendEmailOtp, verifyEmailOtp } from "../../lib/api.service";

interface OtpVerificationProps {
  userId: string | undefined;
  email: string;
  isVerified: boolean;
  onVerificationSuccess: () => void;
}

export default function OtpVerification({ userId, email, isVerified, onVerificationSuccess }: OtpVerificationProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  useEffect(() => {
    if (isVerified) {
      setOtpSent(false);
      setOtp("");
      setOtpError("");
      setOtpMessage("");
    }
  }, [isVerified]);

  const handleSendOtp = async () => {
    if (!userId) return;
    setOtpMessage("Sending OTP...");
    try {
      await sendEmailOtp(userId);
      setOtpSent(true);
      setOtpMessage("An OTP has been sent to your email.");
    } catch (error) {
      console.error("Failed to send OTP", error);
      setOtpMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!userId || otp.length !== 4) {
      setOtpError("Please enter a 4-digit OTP.");
      return;
    }
    setIsVerifying(true);
    setOtpError("");
    try {
      const response = await verifyEmailOtp(userId, otp);
      if (response.email_verified) {
        onVerificationSuccess();
        setOtpSent(false);
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setOtp(value);
      if (otpError) setOtpError("");
    }
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Typography variant="h6" pb={2} sx={{ fontWeight: 600 }}>
        Email Verification
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="Email"
          value={email}
          fullWidth
          disabled
          size="medium"
        />
        {!isVerified && (
          <FormControlLabel
            control={<Checkbox checked={otpSent} onChange={handleSendOtp} disabled={otpSent} />}
            label={otpSent ? "OTP Sent" : "Verify"}
          />
        )}
        {isVerified && (
          <Typography color="success.main" sx={{ whiteSpace: "nowrap" }}>
            ✓ Verified
          </Typography>
        )}
      </Box>
      {otpMessage && !otpSent && <FormHelperText sx={{ mt: 1 }}>{otpMessage}</FormHelperText>}
      
      {otpSent && !isVerified && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <TextField
            label="Enter 4-Digit OTP"
            value={otp}
            onChange={handleOtpChange}
            error={!!otpError}
            helperText={otpError || otpMessage}
            fullWidth
            size="medium"
            inputProps={{ maxLength: 4 }}
          />
          <Button onClick={handleVerifyOtp} variant="outlined" disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </Box>
      )}
    </Box>
  );
}