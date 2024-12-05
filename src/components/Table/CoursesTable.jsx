import React, { useState, useEffect, useMemo } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  Typography, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: '8px'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '8px'
}));

const CoursesTable = ({courses}) => {
  const [selectedNSTP1, setSelectedNSTP1] = useState('');
  const [matchingNSTP2, setMatchingNSTP2] = useState(null);
  const [nstp1Courses, setNSTP1Courses] = useState([]);
  const [nstp2Courses, setNSTP2Courses] = useState([]);
  const [selectedHistKas, setSelectedHistKas] = useState('');
  const [selectedElective1, setSelectedElective1] = useState('');
  const [selectedElective2, setSelectedElective2] = useState('');
  const [selectedElective3, setSelectedElective3] = useState('');

  // Auto-select completed NSTP course when courses prop changes
  useEffect(() => {
    if (Array.isArray(courses) && courses.length > 0) {
      // Find completed NSTP 1 course directly from courses prop
      const completedNSTP = courses.find(course => 
        (course.course_id?.toLowerCase().includes('nstp') || 
         course.name?.toLowerCase().includes('national service') ||
         course.category?.toLowerCase().includes('national')) &&
        (course.course_id?.includes('1') || course.name?.includes('1')) &&
        course.status === 1
      );

      if (completedNSTP) {
        setSelectedNSTP1(completedNSTP.course_id);
      }

      // Auto-select completed HIST 1 or KAS 1
      const completedHistKas = courses.find(course => 
        (course.course_id?.toLowerCase().startsWith('hist 1') || 
         course.course_id?.toLowerCase().startsWith('kas 1')) && 
        course.status === 1
      );

      if (completedHistKas) {
        setSelectedHistKas(completedHistKas.course_id);
      }
    }
  }, [courses]);

  const getNSTPType = (courseId = '', courseName = '') => {
    const id = courseId.toLowerCase();
    const name = courseName.toLowerCase();
    
    // Try to match by ID first (more reliable)
    if (id.includes('rotc')) return 'rotc';
    if (id.includes('cwts')) return 'cwts';
    if (id.includes('lts')) return 'lts';
    
    // Fallback to name matching
    if (name.includes('reserve officers')) return 'rotc';
    if (name.includes('civil welfare')) return 'cwts';
    if (name.includes('literacy')) return 'lts';
    
    return 'unknown';
  };

  // Update matching NSTP 2 whenever NSTP 1 selection changes
  useEffect(() => {
    const selectedCourse = nstp1Courses.find(course => course.course_id === selectedNSTP1);
    
    if (selectedCourse) {
      const type = getNSTPType(selectedCourse.course_id, selectedCourse.name);
      
      // Find NSTP 2 course of the same type
      const matching = nstp2Courses.find(course => 
        getNSTPType(course.course_id, course.name) === type
      );
      setMatchingNSTP2(matching || null);
    } else {
      setMatchingNSTP2(null);
    }
  }, [selectedNSTP1, nstp1Courses, nstp2Courses]);

  const groupedCourses = React.useMemo(() => {
    if (!Array.isArray(courses)) return {};
    
    const nstp1List = [];
    const nstp2List = [];
    
    const grouped = courses.reduce((acc, course) => {
      if (!course || !course.year || !course.term) return acc;
      
      // Check if course is NSTP
      if (course.course_id?.toLowerCase().includes('nstp') || 
          course.name?.toLowerCase().includes('national service') ||
          course.category?.toLowerCase().includes('national')) {
        
        // Separate NSTP 1 and NSTP 2
        if (course.course_id?.includes('1') || course.name?.includes('1')) {
          nstp1List.push({
            ...course,
            units: course.units || 3,
            status: course.status === 1
          });
        } else {
          nstp2List.push({
            ...course,
            units: course.units || 3,
            status: course.status === 1
          });
        }
        return acc;
      }

      // Skip HIST 1 and KAS 1 in regular course listing for 2nd year 2nd sem
      if (course.year === '2nd Year' && 
          course.term === '2nd Semester' && 
          (course.course_id?.toLowerCase().startsWith('hist 1') || 
           course.course_id?.toLowerCase().startsWith('kas 1'))) {
        return acc;
      }

      // Skip all elective courses in regular listing
      if (course.category?.endsWith('Elective')) {
        return acc;
      }
      
      const yearString = course.year;
      if (!acc[yearString]) {
        acc[yearString] = {
          '1st Semester': [],
          '2nd Semester': []
        };
      }
      if (acc[yearString][course.term]) {
        acc[yearString][course.term].push({
          ...course,
          units: course.units || 3,
          status: course.status === 1
        });
      }
      
      return acc;
    }, {});

    // Update NSTP courses state
    setNSTP1Courses(nstp1List);
    setNSTP2Courses(nstp2List);
    return grouped;
  }, [courses]);

  const shouldExcludeFromUnits = (course) => {
    const category = (course.category || '').toLowerCase();
    return category.startsWith('physical') || category.startsWith('national');
  };

  const calculateSemesterUnits = (courses) => {
    if (!Array.isArray(courses)) return 0;
    return courses.reduce((total, course) => {
      if (shouldExcludeFromUnits(course)) return total;
      return total + (course.units || 3);
    }, 0);
  };

  const renderNSTPSelect = (isFirstSem, year) => {
    // Only show NSTP in second year
    if (year !== '2nd Year') return null;

    if (isFirstSem) {
      const courses = nstp1Courses;
      const value = selectedNSTP1;
      const selectedCourse = courses.find(course => course.course_id === value);

      return (
        <>
          <TableCell align="center">
            <FormControl fullWidth size="small">
              <InputLabel>NSTP 1</InputLabel>
              <Select
                value={value}
                onChange={(e) => {
                  setSelectedNSTP1(e.target.value);
                }}
                label="NSTP 1"
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        None
                      </Typography>
                    );
                  }
                  const selectedCourse = nstp1Courses.find(course => course.course_id === selected);
                  return (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          lineHeight: 1.2
                        }}
                      >
                        {selectedCourse.course_id}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          lineHeight: 1.2,
                          fontSize: '0.8rem'
                        }}
                      >
                        {selectedCourse.name}
                      </Typography>
                    </Box>
                  );
                }}
                sx={{ 
                  '.MuiSelect-select': { 
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '3rem'
                  },
                  '& .MuiMenuItem-root': { 
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem 
                  value="" 
                  sx={{ 
                    py: 0.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '2rem'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      textAlign: 'center',
                      width: '100%'
                    }}
                  >
                    None
                  </Typography>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem 
                    key={course.course_id} 
                    value={course.course_id} 
                    sx={{ 
                      py: 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      minHeight: '3rem'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        lineHeight: 1.2
                      }}
                    >
                      {course.course_id}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ 
                        lineHeight: 1.2,
                        fontSize: '0.8rem'
                      }}
                    >
                      {course.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </TableCell>
          <TableCell align="center">
            {selectedCourse ? selectedCourse.units : ''}
          </TableCell>
          <TableCell align="center">
            {selectedCourse ? (selectedCourse.status ? "✓" : "✗") : ""}
          </TableCell>
        </>
      );
    } else {
      return (
        <>
          <TableCell align="center">
            <Box>
              {matchingNSTP2 ? (
                <>
                  <Typography variant="body2">
                    {matchingNSTP2.course_id}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {matchingNSTP2.name}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">
                  Please select NSTP 1
                </Typography>
              )}
            </Box>
          </TableCell>
          <TableCell align="center">
            {matchingNSTP2 ? matchingNSTP2.units : ''}
          </TableCell>
          <TableCell align="center">
            {matchingNSTP2 ? (matchingNSTP2.status ? "✓" : "✗") : ""}
          </TableCell>
        </>
      );
    }
  };

  const renderHistKasSelect = (courses) => {
    // Filter and remove duplicates based on course_id
    const options = Array.from(new Map(
      courses
        .filter(course => 
          course.course_id?.toLowerCase().startsWith('hist 1') ||
          course.course_id?.toLowerCase().startsWith('kas 1')
        )
        .map(course => [course.course_id, course]) // use course_id as the key
    ).values());

    const selectedCourse = options.find(course => course.course_id === selectedHistKas);

    return (
      <>
        <TableCell align="center">
          <FormControl fullWidth size="small">
            <InputLabel>HIST 1/KAS 1</InputLabel>
            <Select
              value={selectedHistKas}
              onChange={(e) => setSelectedHistKas(e.target.value)}
              label="HIST 1/KAS 1"
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      None
                    </Typography>
                  );
                }
                const selectedCourse = options.find(course => course.course_id === selected);
                return (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        lineHeight: 1.2
                      }}
                    >
                      {selectedCourse.course_id}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ 
                        lineHeight: 1.2,
                        fontSize: '0.8rem'
                      }}
                    >
                      {selectedCourse.name}
                    </Typography>
                  </Box>
                );
              }}
              sx={{ 
                '.MuiSelect-select': { 
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '3rem'
                },
                '& .MuiMenuItem-root': { 
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem 
                value="" 
                sx={{ 
                  py: 0.5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '2rem'
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    width: '100%'
                  }}
                >
                  None
                </Typography>
              </MenuItem>
              {options.map((course) => (
                <MenuItem 
                  key={course.course_id} 
                  value={course.course_id} 
                  sx={{ 
                    py: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '3rem'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      lineHeight: 1.2
                    }}
                  >
                    {course.course_id}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ 
                      lineHeight: 1.2,
                      fontSize: '0.8rem'
                    }}
                  >
                    {course.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="center">
          {selectedCourse ? selectedCourse.units : ''}
        </TableCell>
        <TableCell align="center">
          {selectedCourse ? (selectedCourse.status ? "✓" : "✗") : ""}
        </TableCell>
      </>
    );
  };

  const renderElectiveSelect = (courses, semester, dropdownType) => {
    // Get all unique elective categories
    const categories = {};
    const uniqueCourses = new Map();
    const allowedCategories = dropdownType === 'mathcs' 
      ? ['DMCS - Elective', 'Math - Elective', 'Computer Science - Elective']
      : null; // null means allow all electives for free elective

    // Filter and categorize elective courses
    courses.forEach(course => {
      // Skip if we already have this course
      if (uniqueCourses.has(course.course_id)) return;

      // Check if category ends with "Elective"
      if (course.category?.endsWith('Elective')) {
        // For Math/CS electives, only include specific categories
        if (dropdownType === 'mathcs' && !allowedCategories.includes(course.category)) {
          return;
        }

        // Initialize category array if it doesn't exist
        if (!categories[course.category]) {
          categories[course.category] = [];
        }
        categories[course.category].push(course);
        uniqueCourses.set(course.course_id, true);
      }
    });

    // Sort categories alphabetically
    const sortedCategories = Object.keys(categories).sort();

    let selectedValue, setSelectedValue, label;
    if (semester === '1st Semester') {
      selectedValue = selectedElective1;
      setSelectedValue = setSelectedElective1;
      label = 'Select Math/CS Elective';
    } else if (dropdownType === 'mathcs') {
      selectedValue = selectedElective3;
      setSelectedValue = setSelectedElective3;
      label = 'Select Math/CS Elective';
    } else {
      selectedValue = selectedElective2;
      setSelectedValue = setSelectedElective2;
      label = 'Select Free Elective';
    }

    return (
      <>
        <TableCell align="center">
          <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              label={label}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      None
                    </Typography>
                  );
                }
                const selectedCourse = courses.find(course => course.course_id === selected);
                return (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        lineHeight: 1.2
                      }}
                    >
                      {selectedCourse.course_id}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ 
                        lineHeight: 1.2,
                        fontSize: '0.8rem'
                      }}
                    >
                      {selectedCourse.name}
                    </Typography>
                  </Box>
                );
              }}
              sx={{ 
                '.MuiSelect-select': { 
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '3rem'
                },
                '& .MuiMenuItem-root': { 
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem 
                value="" 
                sx={{ 
                  py: 0.5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '2rem'
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    width: '100%'
                  }}
                >
                  None
                </Typography>
              </MenuItem>
              {sortedCategories.map(category => [
                <ListSubheader key={category}>{category}</ListSubheader>,
                ...categories[category].map(course => (
                  <MenuItem 
                    key={course.course_id} 
                    value={course.course_id} 
                    sx={{ 
                      py: 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      minHeight: '3rem'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        lineHeight: 1.2
                      }}
                    >
                      {course.course_id}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ 
                        lineHeight: 1.2,
                        fontSize: '0.8rem'
                      }}
                    >
                      {course.name}
                    </Typography>
                  </MenuItem>
                ))
              ]).flat()}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="center">3</TableCell>
        <TableCell align="center">✗</TableCell>
      </>
    );
  };

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      {years.map((year) => (
        <TableContainer key={year} component={Paper} sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={6} align="center">
                  {year.toUpperCase()}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <HeaderCell colSpan={3}>First Semester</HeaderCell>
                <HeaderCell colSpan={3}>Second Semester</HeaderCell>
              </TableRow>
              <TableRow>
                <HeaderCell>Course</HeaderCell>
                <HeaderCell>Units</HeaderCell>
                <HeaderCell>Status</HeaderCell>
                <HeaderCell>Course</HeaderCell>
                <HeaderCell>Units</HeaderCell>
                <HeaderCell>Status</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* NSTP Row for 2nd Year */}
              {year === '2nd Year' && (
                <StyledTableRow>
                  {renderNSTPSelect(true, year)}
                  {renderNSTPSelect(false, year)}
                </StyledTableRow>
              )}
              {/* Regular courses */}
              {Array.from({ length: Math.max(
                groupedCourses[year]?.['1st Semester']?.length || 0,
                groupedCourses[year]?.['2nd Semester']?.length || 0
              ) }).map((_, index) => {
                const firstSemCourse = groupedCourses[year]?.['1st Semester']?.[index] || {};
                const secondSemCourse = groupedCourses[year]?.['2nd Semester']?.[index] || {};

                // Add HIST/KAS dropdown in the last regular course row for 2nd year
                if (year === '2nd Year' && 
                    index === Math.max(
                      groupedCourses[year]?.['1st Semester']?.length || 0,
                      groupedCourses[year]?.['2nd Semester']?.length || 0
                    ) - 1) {
                  return (
                    <StyledTableRow key={`regular-${index}`}>
                      <TableCell align="center">
                        {firstSemCourse.course_id ? `${firstSemCourse.course_id}` : ''}
                        {firstSemCourse.name && (
                          <Typography variant="body2" color="textSecondary">
                            {firstSemCourse.name}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">{firstSemCourse.units || ''}</TableCell>
                      <TableCell align="center">
                        {firstSemCourse.course_id ? (firstSemCourse.status ? "✓" : "✗") : ""}
                      </TableCell>
                      {renderHistKasSelect(courses)}
                    </StyledTableRow>
                  );
                }

                // Add elective dropdowns in 3rd year
                if (year === '3rd Year' && 
                    index === Math.max(
                      groupedCourses[year]?.['1st Semester']?.length || 0,
                      groupedCourses[year]?.['2nd Semester']?.length || 0
                    ) - 1) {
                  return (
                    <>
                      <StyledTableRow key={`regular-${index}`}>
                        <TableCell align="center">
                          {firstSemCourse.course_id ? `${firstSemCourse.course_id}` : ''}
                          {firstSemCourse.name && (
                            <Typography variant="body2" color="textSecondary">
                              {firstSemCourse.name}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">{firstSemCourse.units || ''}</TableCell>
                        <TableCell align="center">
                          {firstSemCourse.course_id ? (firstSemCourse.status ? "✓" : "✗") : ""}
                        </TableCell>
                        {renderElectiveSelect(courses, '2nd Semester', 'mathcs')}
                      </StyledTableRow>
                      <StyledTableRow key="electives">
                        {renderElectiveSelect(courses, '1st Semester', 'mathcs')}
                        {renderElectiveSelect(courses, '2nd Semester', 'free')}
                      </StyledTableRow>
                    </>
                  );
                }

                // Skip rendering if it's a HIST 1 or KAS 1 course in 2nd year 2nd sem
                if (year === '2nd Year' && 
                    secondSemCourse.course_id && 
                    (secondSemCourse.course_id.toLowerCase().startsWith('hist 1') || 
                     secondSemCourse.course_id.toLowerCase().startsWith('kas 1'))) {
                  return null;
                }

                return (
                  <StyledTableRow key={index}>
                    <TableCell align="center">
                      {firstSemCourse.course_id ? `${firstSemCourse.course_id}` : ''}
                      {firstSemCourse.name && (
                        <Typography variant="body2" color="textSecondary">
                          {firstSemCourse.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">{firstSemCourse.units || ''}</TableCell>
                    <TableCell align="center">
                      {firstSemCourse.course_id ? (firstSemCourse.status ? "✓" : "✗") : ""}
                    </TableCell>
                    <TableCell align="center">
                      {secondSemCourse.course_id ? `${secondSemCourse.course_id}` : ''}
                      {secondSemCourse.name && (
                        <Typography variant="body2" color="textSecondary">
                          {secondSemCourse.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">{secondSemCourse.units || ''}</TableCell>
                    <TableCell align="center">
                      {secondSemCourse.course_id ? (secondSemCourse.status ? "✓" : "✗") : ""}
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
            <TableHead>
              <TableRow>
                <HeaderCell colSpan={2}></HeaderCell>
                <HeaderCell align="right">
                  Unit Total: {calculateSemesterUnits(groupedCourses[year]?.['1st Semester'] || [])}
                </HeaderCell>
                <HeaderCell colSpan={2}></HeaderCell>
                <HeaderCell align="right">
                  Unit Total: {calculateSemesterUnits(groupedCourses[year]?.['2nd Semester'] || [])}
                </HeaderCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
};

export default CoursesTable;