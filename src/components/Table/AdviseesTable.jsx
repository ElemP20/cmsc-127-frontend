import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Chip, Typography } from '@mui/material';
import axiosInstance from '../../utilities/axiosInstance';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import getYear from '../../utilities/getYear';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { usePrograms } from '../../models/ProgramModel';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 16
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  backgroundColor: status ? theme.palette.success.light : theme.palette.warning.light,
  color: status ? theme.palette.success : theme.palette.warning,
  fontWeight: 'bold'
}));

const AdviseesTable = ({advisees, students}) => {
  const { programs } = usePrograms();
  const navigate = useNavigate();

  const getProgramName = (programCode) => {
    const program = programs.find(p => p.program_id == programCode);
    return program ? program.program_name : programCode;
  };

  const getStudentDetails = (studentId) => {
    const student = students.find(s => s.id == studentId);
    return student;
  }

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/advisers/delete/${id}`);
      alert(response.data.message);
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box p={2} bgcolor="primary.main" color="white">
        <Typography variant="h6" fontWeight="bold">
          Student Advisees
        </Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>ID Number</StyledTableCell>
            <StyledTableCell>Student Name</StyledTableCell>
            <StyledTableCell>Year Level</StyledTableCell>
            <StyledTableCell>Program</StyledTableCell>
            <StyledTableCell>Student Status</StyledTableCell>
            <StyledTableCell>Tag Status</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advisees.map((advisee) => {
            const studentDetails = getStudentDetails(advisee.student_id);
            return studentDetails ? (
              <StyledTableRow key={advisee.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {studentDetails.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {`${studentDetails.stud_Fname} ${studentDetails.stud_Mname || ''} ${studentDetails.stud_Lname}`}
                  </Typography>
                </TableCell>
                <TableCell>{getYear(studentDetails.stud_yr)}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {getProgramName(studentDetails.program_id)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip 
                    label={studentDetails.status} 
                    status={studentDetails.status}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <StatusChip 
                    label={advisee.status ? 'Tagged' : 'Not Tagged'} 
                    status={advisee.status}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<WysiwygIcon />}
                      onClick={() => navigate(`/viewChecklist/`, {
                        state: {
                          id: studentDetails.id,
                          student_id: studentDetails.id,
                          stud_Fname: studentDetails.stud_Fname,
                          stud_Mname: studentDetails.stud_Mname,
                          stud_Lname: studentDetails.stud_Lname,
                          stud_yr: studentDetails.stud_yr,
                          stud_email: studentDetails.stud_email,
                          program: getProgramName(studentDetails.program_id),
                          status: advisee.status || 'Not Tagged'
                        }
                      })}
                      sx={{ mr: 1 }}
                    >
                      View Checklist
                    </Button>
                    {/* <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleDelete(advisee.id)}
                    >
                      Remove
                    </Button> */}
                  </Box>
                </TableCell>
              </StyledTableRow>
            ) : null;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AdviseesTable