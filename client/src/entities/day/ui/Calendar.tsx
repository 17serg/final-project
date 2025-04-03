import { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, FitnessCenter } from '@mui/icons-material';
import { DayApi } from '../api/DayApi';
import { Day } from '../model/types';
import { UserContext, UserContextType } from '@/entities/user/provider/UserProvider';

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Calendar = (): React.ReactElement => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Day[]>([]);
  const { user } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    if (user) {
      loadDays();
    }
  }, [currentDate, user]);

  const loadDays = async (): Promise<void> => {
    try {
      const response = await DayApi.getDaysByMonth(currentDate, user!.id);
      setDays(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке дней:', error);
    }
  };

  const handlePrevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = async (date: Date): Promise<void> => {
    if (!user) return;

    const existingDay = days.find(
      (day) => new Date(day.date).toDateString() === date.toDateString(),
    );

    try {
      if (existingDay) {
        await DayApi.updateDay(existingDay.id, {
          isTraining: !existingDay.isTraining,
        });
      } else {
        const now = new Date().toISOString();
        await DayApi.createDay({
          date: date.toISOString(),
          isTraining: true,
          userId: user.id,
          createdAt: now,
          updatedAt: now,
        });
      }
      loadDays();
    } catch (error) {
      console.error('Ошибка при обновлении дня:', error);
    }
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isCurrentDay = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTrainingDay = (date: Date): boolean => {
    return days.some(
      (day) => new Date(day.date).toDateString() === date.toDateString() && day.isTraining,
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
        </Typography>
        <Box>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={1}>
        {DAYS_OF_WEEK.map((day) => (
          <Grid item xs key={day}>
            <Typography align="center" variant="subtitle2">
              {day}
            </Typography>
          </Grid>
        ))}

        {getDaysInMonth(currentDate).map((date, index) => (
          <Grid item xs key={index}>
            <Box
              sx={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                bgcolor: isCurrentDay(date) ? 'primary.light' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => handleDayClick(date)}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isCurrentDay(date) ? 'primary.contrastText' : 'text.primary',
                }}
              >
                {date.getDate()}
              </Typography>
              {isTrainingDay(date) && (
                <FitnessCenter
                  sx={{
                    ml: 0.5,
                    color: 'primary.main',
                    fontSize: '1rem',
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
