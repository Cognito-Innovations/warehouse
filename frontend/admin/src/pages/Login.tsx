import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner'
import PasswordStrength from '../components/common/PasswordStrength';

const fullScreenStyle: SxProps<Theme> = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // TODO: Uncomment this when we have a way to check if the user is authenticated
  // Redirect if already authenticated
  // React.useEffect(() => {
  //   if (!isLoading) {
  //     if(getCookie('user_data')){
  //       const from =  '/packages/all';
  //       navigate(from, { replace: true });
  //     }
  //   }
  // }, [isLoading]);

  const passwordValidation = useMemo(() => {
    const pass = formData.password;
    return {
      length: pass.length >= 6,
      uppercase: /[A-Z]/.test(pass),
      lowercase: (pass.match(/[a-z]/g) || []).length >= 2,
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass),
    };
  }, [formData.password]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else  if (Object.values(passwordValidation).some(v => !v)) {
      newErrors.password = 'Please meet all password requirements.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      const from =  '/packages/all';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={fullScreenStyle}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          background: 'white',
          overflow: 'visible', // ✨ This is the fix!
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#8b5cf6',
              fontFamily: 'cursive',
              letterSpacing: '-0.5px',
            }}
          >
            Palakart Admin
          </Typography>
        </Box>

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#8b5cf6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8b5cf6',
                },
              },
            }}
          />

          <Box sx={{ position: 'relative' }}>  
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)} 
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: '#64748b', marginRight: '1px' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#8b5cf6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
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
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #8b5cf6 30%, #7c3aed 90%)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #7c3aed 30%, #6d28d9 90%)',
              },
              '&:disabled': {
                background: '#d1d5db',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'LOGIN'
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;