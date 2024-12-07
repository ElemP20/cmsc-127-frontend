import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axiosInstance from '../../utilities/axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import { StayCurrentLandscapeOutlined } from '@mui/icons-material';

const SysAdmin = () => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [schoolYear, setSchoolYear] = useState(dayjs().year());
  const [semester, setSemester] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentEnrollment = async () => {
    try {
      const response = await axiosInstance.get("/advisers/getEnrollmentDetails");
      if (response.data && response.data.length > 0) {
        const enrollment = response.data[0];
        setStartDate(dayjs(enrollment.startDate));
        setEndDate(dayjs(enrollment.endDate));
        setSchoolYear(enrollment.schoolYear);
        setSemester(enrollment.semester);
      }
    } catch (error) {
      console.error("Error fetching enrollment details:", error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log({
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD'),
        School_Year: schoolYear,
        Semester: semester
      });
      await axiosInstance.post("/advisers/updateEnrollmentDetails", {
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD'),
        School_Year: schoolYear,
        Semester: semester
      });
      alert("Enrollment Period Updated Successfully");
      getCurrentEnrollment();
    } catch (error) {
      console.error("Error updating enrollment details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetTagging = () => {
    axiosInstance
      .post("/advisers/resetTag")
      .then((response) => {
        alert("Tagging reset successfully");
      })
      .catch((error) => {
        console.error("Error resetting tagging:", error);
      });
  };

  const years = Array.from(
    { length: 11 }, 
    (_, i) => dayjs().year() - 5 + i
  );

  return (
    <>
      <Navbar/>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Enrollment Period Settings
          </Typography>
          <Stack spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                sx={{ width: '100%' }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel>School Year</InputLabel>
              <Select
                value={schoolYear}
                label="School Year"
                onChange={(e) => setSchoolYear(e.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={semester}
                label="Semester"
                onChange={(e) => setSemester(e.target.value)}
              >
                <MenuItem value={1}>1st Semester</MenuItem>
                <MenuItem value={2}>2nd Semester</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                Update Enrollment Period
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetTagging}
                sx={{ flex: 1 }}
              >
                Reset Tagging
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default SysAdmin;
