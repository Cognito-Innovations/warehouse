import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

import { createUser, getCouriers } from "../../services/api.services";
import { ROLES } from "../../utils/constants";
import type { UserRole } from "../../data/menuItems";
import { LoadingEndAdornment } from "../common/LoadingEndAdornment";

interface Courier {
  id: string;
  name: string;
  country_name: string;
}

interface FormData {
  email: string;
  password: string;
  role: UserRole;
  courierId: string;
}

interface Errors {
  email: string;
  password: string;
  role: string;
  courierId: string;
}

interface Touched {
  email: boolean;
  password: boolean;
  role: boolean;
  courierId: boolean;
}

const initialFormData: FormData = {
  email: "",
  password: "",
  role: "user",
  courierId: "",
};

const initialErrors: Errors = {
  email: "",
  password: "",
  role: "",
  courierId: "",
};

const initialTouched: Touched = {
  email: false,
  password: false,
  role: false,
  courierId: false,
};

const UserCreateForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>(initialErrors);
  const [touched, setTouched] = useState<Touched>(initialTouched);

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [courierLoading, setCourierLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchCouriers = async () => {
    try {
      const response = await getCouriers();
      setCouriers(response);
      if (response.length > 0) {
        setFormData(prev => ({ ...prev, courierId: response[0].id }));
      }
    } catch (err) {
      setError("Failed to load courier companies");
      console.error(err);
    } finally {
      setCourierLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const validateField = (name: keyof FormData, value: FormData[keyof FormData]) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value as string)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if ((value as string).length < 6) return "Password must be at least 6 characters";
        return "";
      case "role":
        return value ? "" : "Role is required";
      case "courierId":
        return value ? "" : "Courier Company is required";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors: Errors = { ...initialErrors };
    let valid = true;

    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
      if (newErrors[key]) valid = false;
    });

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const name = e.target.name as keyof FormData;
    const value = e.target.value;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await createUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        courier_id: formData.courierId,
        shouldHashPassword: true,
      });

      setSuccess(true);
      setFormData(initialFormData);
      setErrors(initialErrors);
      setTouched(initialTouched);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.values(formData).every(Boolean) &&
    Object.values(errors).every(err => !err);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add New User
      </Typography>

      <TextField
        fullWidth
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={() => handleBlur("email")}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={() => handleBlur("password")}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
      />

      <FormControl fullWidth margin="normal" error={!!errors.role}>
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData.role}
          label="Role"
          onChange={handleChange}
          onBlur={() => handleBlur("role")}
        >
          {ROLES.map(role => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
        {!!errors.role && <FormHelperText>{errors.role}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.courierId}>
        <InputLabel>Courier Company</InputLabel>
        <Select
          name="courierId"
          value={formData.courierId}
          label="Courier Company"
          onChange={handleChange}
          onBlur={() => handleBlur("courierId")}
          disabled={courierLoading}
          endAdornment={<LoadingEndAdornment loading={courierLoading} />}
        >
          {courierLoading ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : couriers.length === 0 ? (
            <MenuItem disabled>No couriers available</MenuItem>
          ) : (
            couriers.map(courier => (
              <MenuItem key={courier.id} value={courier.id}>
                {`${courier.country_name} (${courier.name})`}
              </MenuItem>
            ))
          )}
        </Select>
        {!!errors.courierId && <FormHelperText>{errors.courierId}</FormHelperText>}
      </FormControl>

        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 1 }}>User created successfully</Typography>}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading || !isFormValid}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create User"}
        </Button>
      </Box>
    );
};

export default UserCreateForm;