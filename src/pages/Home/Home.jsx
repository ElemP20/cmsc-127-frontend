import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';

import { 
  Box, 
  Container, 
  CircularProgress, 
  Stack, 
  Typography,
  Fade,
  Alert
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import AdviseesTable from '../../components/Table/AdviseesTable';
import axiosInstance from '../../utilities/axiosInstance';
import AdviserCard from '../../components/Cards/AdviserCard';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [advisees, setAdvisees] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/advisers/getUser");
      if (response.data) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if(error.response?.status === 403){
        localStorage.clear();
        navigate("/Login");
      }
      setError("Failed to load user information");
    }
  };

  const getAllAdvisees = async () => {
    try {
      const response = await axiosInstance.get("/advisers/getAllAdvisees");
      if (response.data) {
        setAdvisees(response.data.advisees);
        setStudents(response.data.students);
      }
    } catch (error) {
      setError("Failed to load advisees");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllAdvisees();
  }, []);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar user={userInfo} />
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          minHeight: '100vh',
          bgcolor: 'grey.50'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ width: { xs: '100%', md: '300px' } }}>
            <Fade in timeout={500}>
              <Stack spacing={2}>
                <AdviserCard userInfo={userInfo} />
              </Stack>
            </Fade>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Fade in timeout={800}>
              <div>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <AdviseesTable advisees={advisees} students={students} />
              </div>
            </Fade>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Home;