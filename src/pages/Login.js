import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/marketplace');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              color: '#7c3aed', 
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            Sign in to your ACCVAULTNG account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" sx={{ color: '#7c3aed' }}>
              Sign up here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;