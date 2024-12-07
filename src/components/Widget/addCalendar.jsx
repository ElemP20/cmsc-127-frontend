import React from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Paper, Box, Typography, Divider } from '@mui/material';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const AddCalendar = ({ startDate, endDate, schoolYear, semester }) => {
  const isInRange = (date) => {
    return dayjs(date).isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]');
  };

  const ServerDay = (props) => {
    const { day, ...other } = props;
    const isHighlighted = isInRange(day);
    const isToday = day.isSame(dayjs(), 'day');

    return (
      <PickersDay 
        {...other} 
        day={day}
        selected={isHighlighted}
        sx={{
          '&.Mui-selected': {
            backgroundColor: isHighlighted ? '#e3f2fd' : 'transparent',
            color: isHighlighted ? '#1976d2' : 'inherit',
            '&:hover': {
              backgroundColor: '#bbdefb',
            },
            '&:focus': {
              backgroundColor: '#bbdefb',
            },
          },
          ...(isToday && {
            border: '2px solid',
            borderColor: '#1976d2',
          }),
        }}
      />
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 0,
        bgcolor: 'background.paper',
        '& .MuiDateCalendar-root': {
          width: '100%',
          maxHeight: 'none',
        },
      }}
    >
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        p: 2,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Enrollment Period
        </Typography>
        <Typography variant="subtitle1">
          School Year {schoolYear} - {semester === 1 ? '1st' : '2nd'} Semester
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ width: '100%' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            readOnly
            defaultValue={dayjs(startDate)}
            slots={{
              day: ServerDay
            }}
            slotProps={{
              day: {
                disableHighlightToday: true,
              }
            }}
            sx={{
              width: '100%',
              height: 'auto',
              '& .MuiPickersCalendarHeader-root': {
                paddingTop: 2,
                paddingLeft: 2,
                paddingRight: 2,
                color: 'primary.main',
              },
              '& .MuiDayCalendar-header': {
                paddingLeft: 2,
                paddingRight: 2,
              },
              '& .MuiDayCalendar-monthContainer': {
                paddingLeft: 2,
                paddingRight: 2,
                paddingBottom: 2,
              },
              '& .MuiPickersCalendarHeader-label': {
                fontWeight: 'bold',
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </Paper>
  );
};

export default AddCalendar;