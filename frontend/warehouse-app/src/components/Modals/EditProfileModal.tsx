"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  Close,
} from "@mui/icons-material";
import { toast, Toaster } from "sonner";
import { updateUser } from "@/lib/api.service";
import { useAuth } from "@/contexts/AuthContext";
import OtpVerification from "../PageComponents/OtpVerification";

export interface ProfileData {
  id_card_passport_no: string;
  name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  alternate_phone_number: string;
  gender: string;
  dob: string;
  email_verified: boolean;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onProfileUpdate: (updatedData: Partial<ProfileData>) => void;
  loading: boolean;
}

export default function EditProfileModal({ open, onClose, profileData, onProfileUpdate, loading }: EditProfileModalProps) {

  const { user } = useAuth();
  const [formData, setFormData] = useState(profileData);
  const [isEmailVerified, setIsEmailVerified] = useState(profileData.email_verified);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (open) {
      fetchData();
      setIsEmailVerified(profileData.email_verified);
    }
  }, [open, profileData.email_verified]);

  // Sync formData when profileData changes (e.g. after fetch completes in parent)
  useEffect(() => {
    if (profileData) {
      setFormData(prev => ({
        ...prev,
        ...profileData,
        dob: profileData.dob ? profileData.dob.split("T")[0] : prev.dob,
      }));
      setIsEmailVerified(profileData.email_verified);
    }
  }, [profileData]);

  useEffect(() => {
    setIsSaving(loading || false);
  }, [loading]);

  const fetchData = async () => {
    setFormData({
      ...profileData,
      dob: profileData.dob ? profileData.dob.split("T")[0] : "",
    });
    setErrors({});
  };

  const handleChange = (field: keyof ProfileData) => (event: any) => {
    let { value } = event.target;

    if (field === "phone_number" || field === "alternate_phone_number") {
      const NON_NUMERIC_CHARACTERS = /[^0-9]/g;
      value = value.replace(NON_NUMERIC_CHARACTERS, "").slice(0, 10);
    }

    if (field === "dob") {
      const todayDate = new Date().toISOString().split("T")[0];
      if (value && value > todayDate) {
        setErrors(prev => ({ ...prev, dob: "Future date is not allowed" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.dob;
          return newErrors;
        });
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete (newErrors as any)[field];
        return newErrors;
      });
    }
  };

  const handleVerificationSuccess = () => {
    setIsEmailVerified(true);
    onProfileUpdate({ email_verified: true });
  };

  const handleSave = async () => {
    if (!isEmailVerified) {
      toast.error("Please verify your email to save changes.");
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        id_card_passport_no: formData.id_card_passport_no,
        name: formData.name,
        phone_code: formData.phone_code,
        phone_number: formData.phone_number,
        alternate_phone_number: formData.alternate_phone_number,
        gender: formData.gender,
        dob: formData.dob,
      };

      await updateUser(user?.id!, payload);

      toast.success("Profile updated successfully");
      onProfileUpdate(payload);
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile. Please check your information and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id_card_passport_no || !formData.id_card_passport_no.trim()) newErrors.id_card_passport_no = "ID Card/Passport No. is required";
    if (!formData.name || !formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.dob || !formData.dob.trim()) newErrors.dob = "Date of birth is required";
    if (!formData.phone_code || !formData.phone_code.trim()) newErrors.phone_code = "Required";
    if (!formData.phone_number || !formData.phone_number.trim()) newErrors.phone_number = "Contact number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const isFormInvalid =
    Object.keys(errors).length > 0 ||
    !formData.id_card_passport_no?.trim() ||
    !formData.name?.trim() ||
    !formData.dob?.trim() ||
    !formData.phone_code?.trim() ||
    !formData.phone_number?.trim() ||
    !formData.gender;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 2
      }}>
        <p className="font-semibold">
          Edit Profile
        </p>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Toaster />
      <DialogContent dividers>
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pb: 2 }}>
            <TextField
              label="ID Card / Passport No *"
              value={formData.id_card_passport_no}
              onChange={handleChange("id_card_passport_no")}
              error={!!errors.id_card_passport_no}
              helperText={errors.id_card_passport_no}
              fullWidth
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="Name *"
              value={formData.name}
              onChange={handleChange("name")}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="DOB"
              type="date"
              value={formData.dob}
              onChange={handleChange("dob")}
              error={!!errors.dob}
              helperText={errors.dob}
              fullWidth
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: today,
                style: { colorScheme: "light" },
              }}
              placeholder="dd/mm/yyyy"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Code"
                value={formData.phone_code}
                onChange={handleChange("phone_code")}
                error={!!errors.phone_code}
                sx={{
                  width: "100px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                size="medium"
                placeholder="+91"
              />

              <TextField
                label="Contact No"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange("phone_number")}
                error={!!errors.phone_number}
                helperText={errors.phone_number}
                fullWidth
                size="medium"
                inputProps={{
                  maxLength: 10
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>

            <TextField
              label="Alternative Contact No"
              type="tel"
              value={formData.alternate_phone_number}
              onChange={handleChange("alternate_phone_number")}
              fullWidth
              size="medium"
              inputProps={{
                maxLength: 10
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <FormControl fullWidth size="medium" error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={handleChange("gender")}
                label="Gender"
                sx={{
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
              </Select>
              {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
            </FormControl>
          </Box>

          <OtpVerification
            userId={user?.id}
            email={formData.email}
            isVerified={isEmailVerified}
            onVerificationSuccess={handleVerificationSuccess}
          />
          {errors.email && <FormHelperText error sx={{ mt: -2, ml: 2 }}>{errors.email}</FormHelperText>}
        </>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || isFormInvalid}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            px: 4,
            py: 1,
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "&:disabled": {
              bgcolor: "action.disabled",
              color: "action.disabled",
            },
          }}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog >
  );
}