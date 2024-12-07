import React from 'react'
import { useMemo, useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CourseDropdown from './CourseDropdown';

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '8px'
}));

const StyledTableRow = styled(TableRow)(({ status }) => ({
  backgroundColor: status ? '#70ff83' : 'inherit',
}));

const PerSemester = ({ courses, term, sem, onCourseSelect, getAvailableCourses, selectedCourses }) => {
  const [totalUnits, setTotalUnits] = useState(0);
  const semesterId = `${term}_${sem}`;

  const { categories, remainingCourses } = useMemo(() => {
    const grouped = {
      "NSTP": [],
      "FREE ELECTIVE": [],
      "MATH/CS ELECTIVE": [],
      "HISTKAS": [],
      "AH" : [],
      "NSM" : [],
      "CSS" : []
  };

  const remaining = [];
  courses.forEach(course => {
    let cont = false;
    if (course.category == "National Service Training Program") {
      grouped["NSTP"].push(course);
      cont = true;
    }
    if (course.category == "DMCS - Elective" || course.category == "Math - Elective" || course.category == "Computer Science - Elective") {
      if (!grouped["MATH/CS ELECTIVE"].some(r => r.course_id === course.course_id)) {
        grouped["MATH/CS ELECTIVE"].push(course);
      }  
      cont = true;
    }
    if (course.category.endsWith("Elective")) {
      if (!grouped["FREE ELECTIVE"].some(r => r.course_id === course.course_id)) {
        grouped["FREE ELECTIVE"].push(course);
      }
      cont = true;
    }
    if (course.course_id == "HIST 1" || course.course_id == "KAS 1") {
      if (!grouped["HISTKAS"].some(r => r.course_id === course.course_id)) {
        grouped["HISTKAS"].push(course);
      }
      cont = true;
    }
    if (course.category == "Arts and Humanities - Elective") {
      if (!grouped["AH"].some(r => r.course_id === course.course_id)) {
        grouped["AH"].push(course);
      }
      cont = true;
    }
    if (course.category == "Natural Sciences and Mathematics - Elective") {
      if (!grouped["NSM"].some(r => r.course_id === course.course_id)) {
        grouped["NSM"].push(course);
      }
      cont = true;
    }
    if (course.category == "Social Sciences and Philisophy - Elective") {
      if (!grouped["CSS"].some(r => r.course_id === course.course_id)) {
        grouped["CSS"].push(course);
      }
      cont = true;
    }
    if (!cont) {
      if (!remaining.some(r => r.course_id === course.course_id)) {
        remaining.push(course);
      }
    }
  });

    return { categories: grouped, remainingCourses: remaining };
  }, [courses]);

  useEffect(() => {
    const fixedUnits = remainingCourses.reduce((sum, course) => sum + course.units, 0);
    const selectedUnits = Object.values(selectedCourses[semesterId] || {}).reduce((sum, course) => {
      return sum + (course ? course.units : 0);
    }, 0);

    setTotalUnits(fixedUnits + selectedUnits);
  }, [remainingCourses, selectedCourses, semesterId]);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <HeaderCell>Course</HeaderCell>
            <HeaderCell>Units</HeaderCell>
            <HeaderCell>Status</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {remainingCourses.map((course) => (
            <StyledTableRow key={course.course_id} status={course.status}>
              <TableCell align="center">
                <Stack direction="Column">
                  <Typography align='center' fontSize={'0.8rem'}>{course.course_id}</Typography>
                  <Typography fontSize={'0.8rem'} color="gray" align='center'>{course.name}</Typography>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <Typography>{course.units}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>{course.status ? "✓" : "✗"}</Typography>
              </TableCell>
            </StyledTableRow>
          ))}
          
          {term === "2ND YEAR" && sem === "2nd Semester" && (
            <CourseDropdown
              type="HIST 1/KAS 1"
              selection={getAvailableCourses(categories["HISTKAS"], semesterId, "HISTKAS")}
              onSelect={(course) => onCourseSelect(semesterId, "HISTKAS", course)}
            />
          )}

          {term === "3RD YEAR" && sem === "1st Semester" && (
            <CourseDropdown
              type="MATH/CS ELECTIVE"
              selection={getAvailableCourses(categories["MATH/CS ELECTIVE"], semesterId, "MATH/CS ELECTIVE")}
              onSelect={(course) => onCourseSelect(semesterId, "MATH/CS ELECTIVE", course)}
            />
          )}

          {term === "3RD YEAR" && sem === "2nd Semester" && (
            <>
              <CourseDropdown
                type="MATH/CS ELECTIVE"
                selection={getAvailableCourses(categories["MATH/CS ELECTIVE"], semesterId, "MATH/CS ELECTIVE")}
                onSelect={(course) => onCourseSelect(semesterId, "MATH/CS ELECTIVE", course)}
              />
              <CourseDropdown
                type="FREE ELECTIVE"
                selection={getAvailableCourses(categories["FREE ELECTIVE"], semesterId, "FREE ELECTIVE")}
                onSelect={(course) => onCourseSelect(semesterId, "FREE ELECTIVE", course)}
              />
            </>
          )}

          {term === "4TH YEAR" && sem === "1st Semester" && (
            <CourseDropdown
              type="FREE ELECTIVE"
              selection={getAvailableCourses(categories["FREE ELECTIVE"], semesterId, "FREE ELECTIVE")}
              onSelect={(course) => onCourseSelect(semesterId, "FREE ELECTIVE", course)}
            />
          )}

          {term === "4TH YEAR" && sem === "2nd Semester" && (
            <>
              <CourseDropdown
                type="MATH/CS ELECTIVE"
                selection={getAvailableCourses(categories["MATH/CS ELECTIVE"], semesterId, "MATH/CS ELECTIVE")}
                onSelect={(course) => onCourseSelect(semesterId, "MATH/CS ELECTIVE", course)}
              />
              <CourseDropdown
                type="Arts and Humanities - Elective"
                selection={getAvailableCourses(categories["AH"], semesterId, "AH")}
                onSelect={(course) => onCourseSelect(semesterId, "AH", course)}
              />
              <CourseDropdown
                type="Natural Sciences and Mathematics - Elective"
                selection={getAvailableCourses(categories["NSM"], semesterId, "NSM")}
                onSelect={(course) => onCourseSelect(semesterId, "NSM", course)}
              />
              <CourseDropdown
                type="Social Sciences and Philosophy - Elective"
                selection={getAvailableCourses(categories["CSS"], semesterId, "CSS")}
                onSelect={(course) => onCourseSelect(semesterId, "CSS", course)}
              />
            </>
          )}
        </TableBody>
      </Table>
      <Typography align='right' sx={{ marginTop: '8px' }}>Total Units: {totalUnits}</Typography>
    </TableContainer>
  );
};

export default PerSemester