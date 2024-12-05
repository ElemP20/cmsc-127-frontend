import React, { useState } from 'react'
import axiosInstance from '../../utilities/axiosInstance';
import { AppBar, Typography, Container, TextField, Button, Card, Box , Divider} from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Add = () => {

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [adviser, setAdviser] = useState("");
  const [program, setProgram] = useState("");
  const [dateOfBirth, setDOB] = useState("");
  const [year, setYear] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/apis/createChecklist", {
        studentID:studentID,
        first_name:firstName,
        middle_name:middleName,
        last_name:lastName,
        adviser_id:adviser,
        program_id:program,
        date_of_birth:dateOfBirth,
        year:year,
        address:address,
        contact:contact,
        email:email,
        password:password
      });
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <AppBar position="static" color="primary" sx ={{p:2, mb:2, flexDirection:'row'}}>
        <Typography variant="h4" sx={{ fontSize: { sm: 20, md: 24 }, flexGrow: 1}}>
          Sample Add Student
        </Typography>
      </AppBar>
      <Card sx={{ p:3, boxShadow:3, width: '0.5' }} variant="outlined">
        <Typography variant="h3" color="text">Add Student Simulation</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 , mt: 2}} component={"form"} onSubmit={ handleAdd }>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="First Name"
              type='text'
              variant="outlined"
              required
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}/>
            <TextField
              label="Middle Name"
              type='text'
              variant="outlined"
              required
              autoComplete="off"
              onChange={(e) => setMiddleName(e.target.value)}/>
            <TextField
              label="Last Name"
              type='text'
              variant="outlined"
              required
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}/>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-evenly'}}>
            <TextField
              label="Student ID"
              type='text'
              variant="outlined"
              required
              autoComplete="off"
              onChange={(e) => setStudentID(e.target.value)}/>
            <FormControl fullWidth variant="outlined">
            <InputLabel id="adviser-label">Adviser</InputLabel>
            <Select
              labelId="adviser-label"
              id="demo-simple-select"
              value={adviser}
              label="Adviser"
              onChange={(e) => setAdviser(e.target.value)}
            >
              <MenuItem value={101}>John A. Doe</MenuItem>
              <MenuItem value={102}>Jane B. Smith</MenuItem>
              <MenuItem value={103}>Michael C. Johnson</MenuItem>
            </Select>
          </FormControl>
          </Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-label">Program</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={program}
              label="Program"
              onChange={(e) => setProgram(e.target.value)}
            >
              <MenuItem value={301}>Bachelor of Science in Computer Science</MenuItem>
              <MenuItem value={302}>Bachelor of Science in Mathemathics</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date of Birth"
            variant="outlined"
            type="date"
            required
            autoComplete="off"
            onChange={(e) => setDOB(e.target.value)}/>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-evenly'}}>
            <TextField
              sx ={{width: '50%'}}
              label="Email"
              variant="outlined"
              type="email"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}/>
            <TextField
              sx ={{width: '50%'}}
              label="Contact Number"
              variant="outlined"
              type="text"
              required
              autoComplete="off"
              onChange={(e) => setContact(e.target.value)}/>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              sx ={{width: '80%'}}
              label="Address"
              type='text'
              variant="outlined"
              required
              autoComplete="off"
              onChange={(e) => setAddress(e.target.value)}/>
            <TextField
              sx ={{width: '20%'}}
              label="Year"
              type='text'
              variant="outlined"
              required
              autoComplete="off"
              onChange={(e) => setYear(e.target.value)}/>
          </Box>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            required
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}/>
          <Button variant="contained" sx={{p:2}} type="submit">Add Student</Button>
        </Box>
      </Card>
    </Container>
  )
}

export default Add