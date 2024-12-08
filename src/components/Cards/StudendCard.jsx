import React from 'react'
import { Box, Typography, Stack, Paper, Link } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import GradeIcon from '@mui/icons-material/Grade';
import EmailIcon from '@mui/icons-material/Email';
import getYear from '../../utilities/getYear';
import { usePrograms } from '../../models/ProgramModel';

const StudendCard = ({studentInfo, userInfo}) => {

  const { programs } = usePrograms();

  console.log(studentInfo, userInfo);

  const getProgramName = (programCode) => {
    const program = programs.find(p => p.program_id == programCode);
    return program ? program.program_name : programCode;
  };

  const getEmailAddress = () => {
    return `${studentInfo?.stud_email}`;
  };

  const getGmailLink = () => {
    const email = getEmailAddress();
    const subject = encodeURIComponent("ADVISING");
    const body = encodeURIComponent(`Dear ${studentInfo?.stud_Fname} ${studentInfo?.stud_Mname ? studentInfo?.stud_Mname + ' ' : ''}${studentInfo?.stud_Lname},\n\n\n\nYours,\n${userInfo?.first_name} ${userInfo?.middle_name ? userInfo?.middle_name + ' ' : ''}${userInfo?.last_name}\nAdviser`);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Student Profile
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {studentInfo?.stud_Fname} {studentInfo?.stud_Mname?.charAt(0)}. {studentInfo?.stud_Lname}
        </Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <BadgeIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Student ID
              </Typography>
            </Stack>
            <Typography variant="h6">
              {studentInfo?.stud_id}
            </Typography>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <EmailIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Email
              </Typography>
            </Stack>
            <Link 
              href={getGmailLink()}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <Typography variant="h6" color="primary">
                {getEmailAddress()}
              </Typography>
            </Link>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <GradeIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Year Level
              </Typography>
            </Stack>
            <Typography variant="h6">
              {getYear(studentInfo?.stud_yr)}
            </Typography>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <SchoolIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Program
              </Typography>
            </Stack>
            <Typography variant="h6">
              {getProgramName(studentInfo?.program_id)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}

export default StudendCard