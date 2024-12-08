import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

import { 
  Box, 
  Container, 
  CircularProgress, 
  Stack, 
  Typography,
  Fade,
  Alert
} from '@mui/material';

import AdviseesTable from '../../components/Table/AdviseesTable';
import axiosInstance from '../../utilities/axiosInstance';
import AdviserCard from '../../components/Cards/AdviserCard';
import AddCalendar from '../../components/Widget/addCalendar'; // Import the AddCalendar component

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [advisees, setAdvisees] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);

  const navigate = useNavigate();

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

  const getEnrollmentDetails = async () => {
    try {
      const response = await axiosInstance.get("/advisers/getEnrollmentDetails");
      if (response.data && response.data.length > 0) {
        setEnrollmentDetails(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching enrollment details:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllAdvisees();
    getEnrollmentDetails();
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
        maxWidth={false}
        sx={{ 
          py: 4,
          minHeight: '100vh',
          bgcolor: 'grey.50',
          maxWidth: '1600px !important'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ width: { xs: '100%', md: '350px' } }}>
            <Fade in timeout={500}>
              <Stack spacing={2}>
                <AdviserCard userInfo={userInfo} />
                {enrollmentDetails && (
                  <>
                    <AddCalendar 
                      startDate={enrollmentDetails.startDate}
                      endDate={enrollmentDetails.endDate}
                      schoolYear={enrollmentDetails.schoolYear}
                      semester={enrollmentDetails.semester}
                    />
                  </>
                )}
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