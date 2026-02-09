import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { toast } from 'sonner';
import PasswordStrength from '../common/PasswordStrength';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordValidation = useMemo(() => {
    const password = formData.password;
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: (password.match(/[a-z]/g) || []).length >= 2,
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
  }, [formData.password]);

  const handleChange =
    (field: 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  const validateForm = () => {
    const validationErrors: Record<string, string> = {};

    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (Object.values(passwordValidation).some(valid => !valid)) {
      validationErrors.password = 'Please meet all password requirements.';
    }
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData.email, formData.password);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        p: 4,
        borderRadius: 3,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img src="/palakart-text-logo.png" alt="Palakart" width={250} height={100} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#8b5cf6',
            fontFamily: 'cursive',
          }}
        />
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          value={formData.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {isPasswordFocused && formData.password && (
            <PasswordStrength password_str={formData.password} />
          )}
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
        </Button>
      </Box>
    </Card>
  );
};

export default LoginForm;