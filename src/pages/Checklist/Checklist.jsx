import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Button, 
  CircularProgress, 
  Stack, 
  Typography,
  Fade,
  Tooltip
} from '@mui/material';
import axiosInstance from '../../utilities/axiosInstance';
import StudendCard from '../../components/Cards/StudendCard';
import Navbar from '../../components/Navbar/Navbar';
import CoursesTable from '../../components/Table/CoursesTable';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const Checklist = () => {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);

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

  const isWithinEnrollmentPeriod = () => {
    if (!enrollmentDetails) return false;
    
    const now = dayjs();
    return now.isBetween(
      dayjs(enrollmentDetails.startDate), 
      dayjs(enrollmentDetails.endDate), 
      'day', 
      '[]'
    );
  };

  const handleTagged = async () => {
    try {
      await axiosInstance.post(`/advisers/tagStudent/`, {
        student_id: data.id,
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
      const response = await axiosInstance.get(`/advisers/getChecklist/${data.student_id}/${data.program_id}`);
      if (response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllCourses();
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
          Loading student checklist...
        </Typography>
      </Box>
    );
  }
  
  return (
    <>
      <Navbar user={userInfo}/>
      <Container 
        maxWidth="100%" 
        sx={{ 
          py: 4,
          minHeight: '100vh'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ width: { xs: '100%', md: '300px' } }}>
            <Fade in timeout={500}>
              <Stack spacing={2}>
                <StudendCard studentInfo={data} userInfo={userInfo}/>
                <Tooltip title={!isWithinEnrollmentPeriod() ? "Action only available during enrollment period" : ""}>
                  <span style={{ width: '100%' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ height: 40, width: '100%' }} 
                      onClick={handleTagged}
                      disabled={!isWithinEnrollmentPeriod()}
                    >
                      {data.status == 1 ? "Remove Tag Status" : "Tag Student"}
                    </Button>
                  </span>
                </Tooltip>
                <Button 
                  variant="outlined"
                  color="primary" 
                  sx={{ height: 40, width: '100%' }} 
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
                <CoursesTable courses={courses} program_id={data.program_id}/>
              </Box>
            </Fade>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export default Checklist