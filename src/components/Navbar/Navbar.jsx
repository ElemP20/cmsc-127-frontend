import React from 'react';
import { AppBar, Button, Typography, Stack, Box } from '@mui/material/';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';

const Navbar = ({user}) => {
  
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <SchoolIcon sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h4" sx={{ 
            fontSize: { sm: 20, md: 24 }, 
            fontWeight: 'bold',
            letterSpacing: 0.5
          }}>
            Advising and Checklist System
          </Typography>
        </Box>
        {user && 
          <Button 
            color="inherit" 
            onClick={onLogout} 
            startIcon={<LogoutIcon/>}
            sx={{ 
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.1)' 
              }
            }}
          >
            Logout
          </Button>
        }
      </Stack>
    </AppBar>
  );
};

export default Navbar;