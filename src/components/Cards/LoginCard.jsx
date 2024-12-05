import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Card,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
} from '@mui/material/'
import axiosInstance from '../../utilities/axiosInstance';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';

const LoginCard = () => {
  const [adviserID, setAdviserID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/advisers/login", {
        adviser_id:adviserID,
        password:password
      });
      if(response.data) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/Home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh'
      }}
    >
      <Paper 
        elevation={12}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              mb: 2,
              width: 56,
              height: 56,
              backgroundColor: 'primary.main',
            }}
          >
            <SchoolIcon />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome Back!
          </Typography>
          <Typography color="textSecondary" variant="body1" align="center">
            Please log in to your account
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5
          }} 
          component="form" 
          onSubmit={handleLogin}
        >
          <TextField
            label="Adviser ID"
            type='text'
            variant="outlined"
            required
            fullWidth
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setAdviserID(e.target.value)}
          />
          
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            required
            fullWidth
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button 
            startIcon={<LoginIcon />} 
            variant="contained" 
            size="large"
            type="submit"
            sx={{
              mt: 2,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'medium',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginCard;