import { Modal, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '@/entities/user/provider/UserProvider';
import { DayApi } from '@/entities/day/api/DayApi';
import { TrainingApi } from '../api/TrainingApi';
import { Day } from '@/entities/day/model/types';

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

  useEffect(() => {
    const fetchDay = async () => {
      if (!user) return;
      try {
        setError(null);
        let foundDay: Day | null = null;

        if (dayId) {
          const response = await DayApi.getDayById(dayId);
          foundDay = response.data;
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
      fetchDay();
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
      // TODO: Добавить навигацию к странице тренировки с ID
      // navigate(`/training/${response.data.id}`);
    } catch (error) {
      console.error('Ошибка при создании тренировки:', error);
      setError('Не удалось создать тренировку');
    } finally {
      setLoading(false);
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
        <Typography variant="h6" component="h2" gutterBottom>
          Тренировочный день
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleGoToTraining}
          sx={{ mt: 2 }}
          disabled={loading || !day || !day.id}
        >
          {loading ? 'Создание тренировки...' : 'К плану тренировки'}
        </Button>
      </Box>
    </Modal>
  );
};

export default TrainingDayModal;
