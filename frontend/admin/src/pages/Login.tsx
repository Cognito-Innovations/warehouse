import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, type SxProps, type Theme } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner'
import LoginForm from '../components/Login/LoginForm';

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

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/packages/all', { replace: true });
    } catch (error) {
      console.error(error);
    }
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
    <Box sx={fullScreenStyle}>
      <LoginForm onSubmit={handleLogin} />
    </Box>
  );
};

export default Login;