import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Button, 
  CircularProgress, 
  Stack, 
  Typography,
  Fade
} from '@mui/material';
import axiosInstance from '../../utilities/axiosInstance';
import StudendCard from '../../components/Cards/StudendCard';
import Navbar from '../../components/Navbar/Navbar';
import CoursesTable from '../../components/Table/CoursesTable';
import { useNavigate } from 'react-router-dom';

const Checklist = () => {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [courses, setCourses] = useState([]);
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

  const handleTagged = async () => {
    try {
      await axiosInstance.post(`/advisers/tagStudent/`, {
        student_id: data.student_id,
        status: data.status
      });
      navigate("/Home");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate("/Home");
  };

  const getAllCourses = async () => {
    try {
      const response = await axiosInstance.get(`/advisers/getChecklist/${data.id}`);
      if (response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      setError("Failed to load courses");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllCourses();
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
          Loading student checklist...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar user={userInfo}/>
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
                <StudendCard studentInfo={data} />
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ height: 40 }} 
                  onClick={handleTagged}
                >
                  {data.status ? "Remove Tag Status" : "Tag Student"}
                </Button>
                <Button 
                  variant="outlined"
                  color="primary" 
                  sx={{ height: 40 }} 
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Stack>
            </Fade>
          </Box>
          <Box sx={{ flexGrow: 1 }} id="courses-table">
            <Fade in timeout={800}>
              <Box>
                <CoursesTable courses={courses} />
              </Box>
            </Fade>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export default Checklist