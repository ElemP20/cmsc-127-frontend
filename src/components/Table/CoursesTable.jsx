import React, { useMemo, useState } from 'react'
import { Stack } from '@mui/material';
import YearTable from './YearTable';

const CoursesTable = ({courses}) => {
  const [selectedCourses, setSelectedCourses] = useState({});
  const [cmsc191Count, setCmsc191Count] = useState(0);

  const handleCourseSelect = (semesterId, type, course) => {
    setSelectedCourses(prev => {
      const oldCourse = prev[semesterId]?.[type];
      // Update CMSC 191 count
      if (oldCourse?.course_id === "CMSC 191") {
        setCmsc191Count(count => count - 1);
      }
      if (course?.course_id === "CMSC 191") {
        setCmsc191Count(count => count + 1);
      }

      return {
        ...prev,
        [semesterId]: {
          ...prev[semesterId],
          [type]: course
        }
      };
    });
  };

  const getAvailableCourses = (courses, semesterId, type) => {
    const selectedElectives = Object.entries(selectedCourses).flatMap(([id, semCourses]) => 
      Object.entries(semCourses).map(([t, course]) => course)
    ).filter(Boolean);

    return courses.filter(course => {
      const currentSelection = selectedCourses[semesterId]?.[type];
      if (currentSelection?.course_id === course.course_id) {
        return true;
      }

      // Special handling for CMSC 191
      if (course.course_id === "CMSC 191") {
        return cmsc191Count < 2;
      }

      const isElective = course.category?.toLowerCase().includes('elective');
      if (isElective) {
        return !selectedElectives.some(selected => selected.course_id === course.course_id);
      }

      return true;
    });
  };

  const groupedCourses = useMemo(() => {
    const grouped = {
      "1st Year": { "1st Semester": [], "2nd Semester": [] },
      "2nd Year": { "1st Semester": [], "2nd Semester": [] },
      "3rd Year": { "1st Semester": [], "2nd Semester": [] },
      "4th Year": { "1st Semester": [], "2nd Semester": [] }
    };

    courses.forEach(course => {
      grouped[course.year][course.term].push(course);
    });

    return grouped;
  }, [courses]);

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  return (
    <Stack gap={2}>
      {years.map((year) => (
        <YearTable 
          key={year}
          courses={groupedCourses[year]} 
          term={year.toUpperCase()}
          onCourseSelect={handleCourseSelect}
          getAvailableCourses={getAvailableCourses}
          selectedCourses={selectedCourses}
        />
      ))}
    </Stack>
  );
};

export default CoursesTable;