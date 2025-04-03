import { useState } from 'react';
import { Paper, Grid, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrainingDayModal from '../../../entities/training/ui/TrainingDayModal';

interface Day {
  date: Date;
  isTraining: boolean;
}

const CalendarCell = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  height: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TrainingIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '5px',
  right: '5px',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (day: Day) => {
    if (day.isTraining) {
      setSelectedDate(day.date);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // TODO: Добавить логику получения дней из API
  const days: Day[] = [];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography variant="subtitle1" align="center">
              {day}
            </Typography>
          </Grid>
        ))}

        {days.map((day, index) => (
          <Grid item xs={12 / 7} key={index}>
            <CalendarCell onClick={() => handleDayClick(day)}>
              <Typography variant="body1">{day.date.getDate()}</Typography>
              {day.isTraining && <TrainingIndicator />}
            </CalendarCell>
          </Grid>
        ))}
      </Grid>

      {selectedDate && (
        <TrainingDayModal open={isModalOpen} onClose={handleCloseModal} date={selectedDate} />
      )}
    </Box>
  );
};

export default Calendar;
