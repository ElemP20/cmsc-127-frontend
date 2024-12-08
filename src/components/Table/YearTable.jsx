import React from 'react'
import { styled } from '@mui/material/styles';
import { Table, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material';
import PerSemester_ComputerScience from './PerSemester_ComputerScience';
import PerSemester_Math from './PerSemester_Math';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  textAlign: 'center',
  padding: '8px'
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '8px'
}));

const YearTable = ({ courses, term, onCourseSelect, getAvailableCourses, selectedCourses, program_id, enrolled}) => {



  if(program_id == 301) {
    return (
      <>
      <Stack>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={6}>{term}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <HeaderCell colSpan={3}>1st Semester</HeaderCell>
                <HeaderCell colSpan={3}>2nd Semester</HeaderCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        <Stack direction={"row"} gap={1}>
          <PerSemester_ComputerScience
            enrolled={enrolled}
            courses={courses["1st Semester"]} 
            term={term} 
            sem={"1st Semester"}
            onCourseSelect={onCourseSelect}
            getAvailableCourses={getAvailableCourses}
            selectedCourses={selectedCourses}
          />
          <PerSemester_ComputerScience
            enrolled={enrolled}
            courses={courses["2nd Semester"]} 
            term={term} 
            sem={"2nd Semester"}
            onCourseSelect={onCourseSelect}
            getAvailableCourses={getAvailableCourses}
            selectedCourses={selectedCourses}
          />
        </Stack>
      </Stack>
      </>
    )
  } else if (program_id == 302) {
    return (
      <>
      <Stack>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={6}>{term}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <HeaderCell colSpan={3}>1st Semester</HeaderCell>
                <HeaderCell colSpan={3}>2nd Semester</HeaderCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        <Stack direction={"row"} gap={1}>
          <PerSemester_Math
            enrolled={enrolled}
            courses={courses["1st Semester"]} 
            term={term} 
            sem={"1st Semester"}
            onCourseSelect={onCourseSelect}
            getAvailableCourses={getAvailableCourses}
            selectedCourses={selectedCourses}
          />
          <PerSemester_Math
            enrolled={enrolled}
            courses={courses["2nd Semester"]} 
            term={term} 
            sem={"2nd Semester"}
            onCourseSelect={onCourseSelect}
            getAvailableCourses={getAvailableCourses}
            selectedCourses={selectedCourses}
          />
        </Stack>
      </Stack>
      </>
    )
  }
}

export default YearTable