import React, { useState } from 'react'
import { FormControl, Select, MenuItem, Stack, Typography, TableRow, TableCell, InputLabel} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ status }) => ({
  backgroundColor: status ? '#70ff83' : 'transparent',
}));

const CourseDropdown = ({selection, onSelect, type}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const format = (course) => {
    return (
      <Stack direction="Column" sx={{ padding: '0px'}}>
        <Typography align='center' fontSize={'0.8rem'}>{course.course_id}</Typography>
        <Typography fontSize={'0.8rem'} color="gray" align='center'>{course.name}</Typography>
      </Stack>
    );
  }

  const handleChange = (event) => {
    const course = selection.find(c => c.course_id === event.target.value);
    setSelectedCourse(course);
    if(onSelect) {
      onSelect(course);
    }
  };

  const getProperLabel =(type) => {
    switch(type){
      case "Arts and Humanities - Elective": return "AH Elective";
      case "Natural Sciences and Mathematics - Elective": return "NSM Elective";
      case "Social Sciences and Philosophy - Elective": return "CSS Elective";
      case "NSTP": return "NSTP";
      case "MATH/CS ELECTIVE": return "Math/CS Elective";
      case "MATH ELECTIVE": return "Math Elective";
      case "HIST 1/KAS 1": return "Hist1/Kas1";
      default: return "Free Elective";
    }
  };

  if(selection.length > 0){
    return (
      <StyledTableRow sx={{ maxHeight: '3rem' }} status={selectedCourse?.status}>
        <TableCell align="center" sx={{ padding: '0px' }}>
          <FormControl size='small' sx={{ minWidth: '450px'}} variant="filled">
            <InputLabel 
              id="dropdown-label"
              sx={{
                transform: 'translate(12px, 8px) scale(1)'
              }}
            >
              <Typography fontSize={'0.8rem'}>{getProperLabel(type)}</Typography>
            </InputLabel>
            <Select
              labelId="dropdown-label"
              value={selectedCourse?.course_id}
              onChange={handleChange}
              renderValue={(value) => format(selection.find(c => c.course_id == value))}
              sx={{
                '& .MuiFilledInput-input': {
                  backgroundColor: 'transparent',
                  paddingTop: '8px',
                  paddingBottom: '8px'
                },
                '&.MuiFilledInput-root': {
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'transparent'
                  },
                  '&:before, &:after': {
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
                  }
                }
              }}
            >
              {selection.map((course) => (
                <MenuItem 
                  key={course.course_id}
                  value={course.course_id}
                  label={course.name}
                  sx={{ 
                    justifyContent: 'center',
                    textAlign: 'center',
                    backgroundColor: course.status ? '#70ff83' : 'transparent',
                  }}
                >
                  {format(course)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="center" sx={{ width: '40'}}>
          <Typography>{selectedCourse?.units}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>{selectedCourse?.status ? "✓" : "✗"}</Typography>
        </TableCell>
      </StyledTableRow>
    )
  }
  return null;
}

export default CourseDropdown