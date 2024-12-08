import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import getYear from '../../utilities/getYear';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { usePrograms } from '../../models/ProgramModel';
import axiosInstance from '../../utilities/axiosInstance';

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

const StatusChip = styled(Chip)(({ status, theme }) => (
  console.log(status),
  {
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

  const handleEditStatus = async(studentId, status) => {
    try {
      const response = await axiosInstance.put(`/advisers/editStatus`, {
        studentID: studentId,
        newStatus: status
      });
      location.reload()
    } catch (error) {
      console.log(error);
    }
  }

  const getStudentDetails = (studentId) => {
    const student = students.find(s => s.stud_id == studentId);
    return student;
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
            return studentDetails && studentDetails.status !== "Expelled" ? (
              <StyledTableRow key={advisee.stud_id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {studentDetails.stud_id}
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
                  <Box display="flex" flexDirection={'column'} gap={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<WysiwygIcon />}
                      onClick={() => navigate(`/viewChecklist/`, {
                        state: {
                          id: studentDetails.stud_id,
                          student_id: studentDetails.stud_id,
                          stud_Fname: studentDetails.stud_Fname,
                          stud_Mname: studentDetails.stud_Mname,
                          stud_Lname: studentDetails.stud_Lname,
                          stud_yr: studentDetails.stud_yr,
                          stud_email: studentDetails.stud_email,
                          program_id: studentDetails.program_id,
                          status: advisee.status
                        }
                      })}
                      sx={{ mr: 1 }}
                    >
                      View Checklist
                    </Button>
                    <Box display="flex" gap={2} alignContent={'center'} justifyContent={'center'}>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleEditStatus(studentDetails.stud_id, studentDetails.status === "Active" ? "LOA" : "Active")}
                        sx={{ mr: 1 }}>{studentDetails.status === "Active" ? "LOA" : "Active"}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleEditStatus(studentDetails.stud_id, "Expelled")}
                        sx={{ mr: 1 }}>Expel
                      </Button>
                    </Box>
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