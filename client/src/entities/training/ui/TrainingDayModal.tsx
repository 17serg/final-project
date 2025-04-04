import { Modal, Box, Typography, Button, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '@/entities/user/provider/UserProvider';
import { DayApi } from '@/entities/day/api/DayApi';
import { TrainingApi } from '../api/TrainingApi';
import { Day } from '@/entities/day/model/types';
import { FitnessCenter, CheckCircle, Error } from '@mui/icons-material';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

interface TrainingDayModalProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  dayId?: number;
}

const TrainingDayModal = ({ open, onClose, date, dayId }: TrainingDayModalProps) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as UserContextType;
  const [day, setDay] = useState<Day | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingTraining, setExistingTraining] = useState<any>(null);

  useEffect(() => {
    const fetchDayAndTraining = async () => {
      if (!user) return;
      try {
        setError(null);
        let foundDay: Day | null = null;

        if (dayId) {
          const response = await DayApi.getDayById(dayId);
          foundDay = response.data;

          // Проверяем наличие тренировки для этого дня
          try {
            const trainingResponse = await TrainingApi.getTrainingByDayId(dayId);
            setExistingTraining(trainingResponse.data);
          } catch (error) {
            // Если тренировка не найдена, это нормально
            setExistingTraining(null);
          }
        } else {
          const response = await DayApi.getDaysByMonth(date, user.id);
          foundDay =
            response.data.find(
              (d: Day) => new Date(d.date).toDateString() === date.toDateString(),
            ) || null;
        }

        console.log('Найденный день:', foundDay);
        setDay(foundDay);
      } catch (error) {
        console.error('Ошибка при получении дня:', error);
        setError('Не удалось загрузить информацию о дне');
      }
    };

    if (open) {
      fetchDayAndTraining();
    }
  }, [date, user, open, dayId]);

  const handleGoToTraining = async () => {
    if (!user || !day || !day.id) {
      setError('Не удалось создать тренировку: отсутствует информация о дне');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const trainingData = {
        dayId: day.id,
        userId: user.id,
        complete: false,
      };
      console.log('Отправляемые данные:', trainingData);

      const response = await TrainingApi.createTraining(trainingData);
      console.log('Ответ сервера:', response);

      onClose();
      navigate(CLIENT_ROUTES.TRAINING.replace(':trainingId', response.data.id.toString()));
    } catch (error) {
      console.error('Ошибка при создании тренировки:', error);
      setError('Не удалось создать тренировку');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToExistingTraining = () => {
    if (existingTraining) {
      navigate(CLIENT_ROUTES.TRAINING.replace(':trainingId', existingTraining.id.toString()));
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="training-day-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h2">
            Тренировочный день
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          {date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {existingTraining && (
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            {existingTraining.complete ? (
              <CheckCircle color="success" />
            ) : (
              <Error color="warning" />
            )}
            <Typography>
              {existingTraining.complete
                ? 'Тренировка уже создана и выполнена'
                : 'Тренировка уже создана, но не выполнена'}
            </Typography>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGoToTraining}
              disabled={!day || !day.id || existingTraining}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              {existingTraining ? 'Тренировка уже создана' : 'Создать тренировочный план'}
            </Button>
            {existingTraining && (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoToExistingTraining}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                К тренировочному плану
              </Button>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default TrainingDayModal;
