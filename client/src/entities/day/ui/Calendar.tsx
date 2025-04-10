import { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, FitnessCenter, Info } from '@mui/icons-material';
import { DayApi } from '../api/DayApi';
import { Day } from '../model/types';
import { UserContext, UserContextType } from '@/entities/user/provider/UserProvider';
import TrainingDayModal from '../../training/ui/TrainingDayModal';
import { TrainingApi } from '../../training/api/TrainingApi';

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface DayWithTraining extends Day {
  trainingComplete?: boolean;
}

export const Calendar = (): React.ReactElement => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<DayWithTraining[]>([]);
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
      const daysWithTrainings = await Promise.all(
        response.data.map(async (day: Day) => {
          try {
            const trainingResponse = await TrainingApi.getTrainingsByDayId(day.id);
            const hasCompletedTraining = trainingResponse.data.some(
              (training: any) => training.complete,
            );
            return { ...day, trainingComplete: hasCompletedTraining };
          } catch (error) {
            return { ...day, trainingComplete: false };
          }
        }),
      );
      setDays(daysWithTrainings);
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
    // Корректировка для начала недели с понедельника (0 = воскресенье, 1 = понедельник, ..., 6 = суббота)
    const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = 0; i < emptyDays; i++) {
      days.push(null);
    }

    // Добавляем дни текущего месяца
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Добавляем пустые дни в конце месяца, чтобы заполнить последнюю неделю
    const totalDays = days.length;
    const remainingDays = 7 - (totalDays % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push(null);
      }
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

  const isCompletedTrainingDay = (date: Date | null): boolean => {
    if (!date) return false;
    return days.some(
      (day) => new Date(day.date).toDateString() === date.toDateString() && day.trainingComplete,
    );
  };

  // Разбиваем дни месяца на недели
  const getWeeks = (): (Date | null)[][] => {
    const allDays = getDaysInMonth(currentDate);
    const weeks: (Date | null)[][] = [];

    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    return weeks;
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

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Заголовки дней недели */}
        <Box sx={{ display: 'flex', mb: 1, position: 'relative', zIndex: 1 }}>
          {DAYS_OF_WEEK.map((day) => (
            <Box
              key={day}
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 1,
                fontWeight: 'bold',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'white',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.5rem !important',
                  fontWeight: 'bold',
                  color: 'black !important',
                  textShadow: '0px 0px 1px rgba(255,255,255,0.8)',
                  position: 'relative',
                  zIndex: 3,
                  lineHeight: 1.2,
                  transform: 'scale(1.1)',
                  transformOrigin: 'center center',
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Сетка с днями месяца */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {getWeeks().map((week, weekIndex) => (
            <Box key={weekIndex} sx={{ display: 'flex' }}>
              {week.map((date, dayIndex) => (
                <Box
                  key={dayIndex}
                  sx={{
                    flex: 1,
                    aspectRatio: '1',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: date ? 'pointer' : 'default',
                    bgcolor: isCompletedTrainingDay(date)
                      ? 'rgba(76, 175, 80, 0.1)'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: date
                        ? isCompletedTrainingDay(date)
                          ? 'rgba(76, 175, 80, 0.2)'
                          : 'action.hover'
                        : 'transparent',
                    },
                    borderRadius: 1,
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    m: 0.5,
                  }}
                  onClick={() => date && handleDayClick(date)}
                >
                  {date && (
                    <>
                      <Typography
                        variant="h5"
                        sx={{
                          color: isCurrentDay(date) ? 'rgba(0, 0, 0, 0.9)' : 'text.primary',
                          fontWeight: isCurrentDay(date) ? 'bold' : 'normal',
                          fontSize: '1.5rem',
                          textShadow: isCurrentDay(date)
                            ? '0px 0px 2px rgba(0,0,0,0.2)'
                            : '0px 0px 1px rgba(0,0,0,0.1)',
                          mb: 1,
                          position: 'relative',
                          '&::after': isCurrentDay(date)
                            ? {
                                content: '""',
                                position: 'absolute',
                                bottom: '4px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '24px',
                                height: '3px',
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                borderRadius: '2px',
                              }
                            : {},
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
                              color: isCompletedTrainingDay(date)
                                ? 'success.main'
                                : 'rgba(0, 0, 0, 0.9)',
                              fontSize: '1.5rem',
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              color: isCompletedTrainingDay(date)
                                ? 'success.main'
                                : 'rgba(0, 0, 0, 0.9)',
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
              ))}
            </Box>
          ))}
        </Box>
      </Box>

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
