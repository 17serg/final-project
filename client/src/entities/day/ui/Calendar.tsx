import { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, FitnessCenter, Info } from '@mui/icons-material';
import { DayApi } from '../api/DayApi';
import { Day } from '../model/types';
import { UserContext, UserContextType } from '@/entities/user/provider/UserProvider';
import TrainingDayModal from '../../training/ui/TrainingDayModal';

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Calendar = (): React.ReactElement => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        if (existingDay.isTraining) {
          await DayApi.updateDay(existingDay.id, {
            isTraining: false,
          });
        } else {
          await DayApi.updateDay(existingDay.id, {
            isTraining: true,
          });
        }
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

  const handleInfoClick = (date: Date): void => {
    const existingDay = days.find(
      (day) => new Date(day.date).toDateString() === date.toDateString(),
    );

    if (!existingDay) {
      console.error('День не найден');
      return;
    }

    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Добавляем пустые дни в начале месяца
    const firstDayOfWeek = firstDay.getDay();
    const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Корректировка для начала недели с понедельника
    for (let i = 0; i < emptyDays; i++) {
      days.push(null);
    }

    // Добавляем дни текущего месяца
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
    <Paper sx={{ p: 4, maxWidth: '75%', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          {currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
        </Typography>
        <Box>
          <IconButton onClick={handlePrevMonth} size="large">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextMonth} size="large">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={1}>
        {DAYS_OF_WEEK.map((day) => (
          <Grid item xs key={day} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {day}
            </Typography>
          </Grid>
        ))}

        {getDaysInMonth(currentDate).map((date, index) => (
          <Grid item xs key={index} sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: date ? 'pointer' : 'default',
                bgcolor: date && isCurrentDay(date) ? 'primary.light' : 'transparent',
                '&:hover': {
                  bgcolor: date ? 'action.hover' : 'transparent',
                },
                borderRadius: 1,
                position: 'relative',
                minHeight: '120px',
              }}
              onClick={() => date && handleDayClick(date)}
            >
              {date && (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      color: isCurrentDay(date) ? 'primary.contrastText' : 'text.primary',
                      fontWeight: isCurrentDay(date) ? 'bold' : 'normal',
                    }}
                  >
                    {date.getDate()}
                  </Typography>
                  {isTrainingDay(date) && (
                    <>
                      <FitnessCenter
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          color: 'primary.main',
                          fontSize: '2rem',
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInfoClick(date);
                        }}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedDate && (
        <TrainingDayModal
          open={isModalOpen}
          onClose={handleCloseModal}
          date={selectedDate}
          dayId={
            days.find((day) => new Date(day.date).toDateString() === selectedDate.toDateString())
              ?.id
          }
        />
      )}
    </Paper>
  );
};
