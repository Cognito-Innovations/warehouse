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
  CircularProgress,
} from "@mui/material";
import {
  Close,
} from "@mui/icons-material";
import { toast, Toaster } from "sonner";
import { getCourierCompanies, getCurrencies, getUserPreferences, sendEmailOtp, updatePreferences, updateUser, verifyEmailOtp } from "@/lib/api.service";
import { useAuth } from "@/contexts/AuthContext";
import { useAddressActions } from "@/contexts/AddressContext";
import OtpVerification from "../PageComponents/OtpVerification";

export interface ProfileData {
  id_card_passport_no: string;
  name: string;
  email: string;
  phone_number: string;
  alternate_phone_number: string;
  gender: string;
  dob: string;
  email_verified: boolean;
}

interface PreferencesData {
  currency_id: string;
  courier_id: string;
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
  const { refreshUserPreferences } = useAddressActions();
  const [formData, setFormData] = useState(profileData);
  const [preferencesFormData, setPreferencesFormData] = useState<PreferencesData>({ courier_id: "", currency_id: "" });
  const [courierCompanies, setCourierCompanies] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(profileData.email_verified);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCourierCompanies = async () => {
    const [courierCompaniesData, currenciesData] = await Promise.all([getCourierCompanies(), getCurrencies()]);
    setCourierCompanies(courierCompaniesData);
    setCurrencies(currenciesData);
  };

  useEffect(() => {
    if (open) {
      fetchData();
      setIsEmailVerified(profileData.email_verified);
    }
  }, [open, profileData]);

  useEffect(() => {
    setIsSaving(loading || false);
  }, [loading]);

  const fetchData = async () => {
    setLoadingPreferences(true);
    await fetchCourierCompanies();
    setFormData({
      ...profileData,
      dob: profileData.dob ? profileData.dob.split("T")[0] : "",
    });
    await fetchUserPreferences();
    setErrors({});
  };

  const fetchUserPreferences = async () => {
    try {
      if (!user?.id) return;

      const prefs = await getUserPreferences(user.id);
      if (prefs) {
        setPreferencesFormData({
          courier_id: prefs.courier?.id || "",
          currency_id: prefs.currency?.id || ""
        });
      }
    } catch (error) {
      console.error("Failed to load preferences", error);
    } finally {
      setLoadingPreferences(false);
    }
  };

  const handleChange = (field: keyof ProfileData) => (event: any) => {
    const { value } = event.target;
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

  const handleChangePreferences = (field: keyof PreferencesData) => (event: any) => {
    const { value } = event.target;
    setPreferencesFormData(prev => ({
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
      await updatePreferences({ ...preferencesFormData, user_id: user?.id });

      const payload = {
        id_card_passport_no: formData.id_card_passport_no,
        name: formData.name,
        phone_number: formData.phone_number,
        alternate_phone_number: formData.alternate_phone_number,
        gender: formData.gender,
        dob: formData.dob,
      };

      await updateUser(user?.id!, payload);

      await refreshUserPreferences();

      onProfileUpdate(payload);
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id_card_passport_no || !formData.id_card_passport_no.trim()) newErrors.id_card_passport_no = "ID Card/Passport No. is required";
    if (!formData.name || !formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.dob || !formData.dob.trim()) newErrors.dob = "Date of birth is required";
    if (!formData.phone_number || !formData.phone_number.trim()) newErrors.phone_number = "Contact number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!preferencesFormData.courier_id) newErrors.courier_id = "Courier is required";
    if (!preferencesFormData.currency_id) newErrors.currency_id = "Currency is required";

    return newErrors;
  };

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
      <DialogContent
        dividers
        sx={{
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => theme.palette.grey[300],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: (theme) => theme.palette.grey[400],
          },
          // Firefox scrollbar support
          scrollbarWidth: 'thin',
          scrollbarColor: (theme) => `${theme.palette.grey[300]} transparent`,
        }}
      >
        <>
          {loadingPreferences && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 2,
                mb: 2,
                bgcolor: "rgba(0, 0, 0, 0.02)",
                borderRadius: 1,
              }}
            >
              <CircularProgress size={24} />
              <Box sx={{ ml: 2, color: "text.secondary" }}>
                Loading preferences...
              </Box>
            </Box>
          )}

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
              placeholder="dd/mm/yyyy"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="Contact No"
              value={formData.phone_number}
              onChange={handleChange("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
              fullWidth
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="Alternative Contact No"
              value={formData.alternate_phone_number}
              onChange={handleChange("alternate_phone_number")}
              fullWidth
              size="medium"
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


          <p className="pb-2 font-semibold">
            Preferences
          </p>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FormControl fullWidth size="medium" error={!!errors.courier_id}>
              <InputLabel>Courier</InputLabel>
              <Select
                value={preferencesFormData.courier_id}
                onChange={handleChangePreferences("courier_id")}
                label="Courier"
                disabled={loadingPreferences}
                sx={{
                  borderRadius: "8px",
                }}
              >
                {loadingPreferences ? (
                  <MenuItem disabled>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={16} />
                      Loading couriers...
                    </Box>
                  </MenuItem>
                ) : (
                  courierCompanies?.map((courier: any) => (
                    <MenuItem key={courier.id} value={courier.id}>
                      {courier.name}, {courier.address}, {courier.country || courier.country?.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.courier_id && <FormHelperText>{errors.courier_id}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth size="medium" error={!!errors.currency_id}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={preferencesFormData.currency_id}
                onChange={handleChangePreferences("currency_id")}
                label="Currency"
                disabled={loadingPreferences}
                sx={{
                  borderRadius: "8px",
                }}
              >
                {loadingPreferences ? (
                  <MenuItem disabled>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={16} />
                      Loading currencies...
                    </Box>
                  </MenuItem>
                ) : (
                  currencies?.map((currency: any) => (
                    <MenuItem key={currency.id} value={currency.id}>{currency.currency_symbol}</MenuItem>
                  ))
                )}
              </Select>
              {errors.currency_id && <FormHelperText>{errors.currency_id}</FormHelperText>}
            </FormControl>
          </Box>
        </>


      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || loadingPreferences}
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
          {isSaving ? "Saving..." : loadingPreferences ? "Loading..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}