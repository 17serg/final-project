import { Box, Container, Typography, Button } from '@mui/material';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { TrainingApi } from '@/entities/training/api/TrainingApi';
import AddExerciseForm from '@/entities/training/ui/AddExerciseForm';

export const TrainingPage = (): React.ReactElement => {
  const { trainingId } = useParams();
  const [training, setTraining] = useState<{ dayId: number } | null>(null);
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);

  useEffect(() => {
    const fetchTraining = async (): Promise<void> => {
      if (trainingId) {
        try {
          const response = await TrainingApi.getTrainingById(Number(trainingId));
          setTraining(response.data);
        } catch (error) {
          console.error('Ошибка при получении тренировки:', error);
        }
      }
    };

    fetchTraining();
  }, [trainingId]);

  const handleAddExercise = (): void => {
    setShowAddExerciseForm(true);
  };

  const handleExerciseSubmit = async (data: {
    exerciseId: number;
    duration: number;
    weight: number;
    sets: number;
    reps: number;
  }): Promise<void> => {
    try {
      if (!trainingId) {
        throw new Error('ID тренировки не найден');
      }

      await TrainingApi.createExerciseOfTraining({
        trainingId: Number(trainingId),
        ...data,
      });

      setShowAddExerciseForm(false);
      // TODO: Обновить список упражнений после добавления
    } catch (error) {
      console.error('Ошибка при добавлении упражнения:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создание тренировочного плана
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          ID тренировки: {trainingId}
        </Typography>
        {training && (
          <Typography variant="body1" color="text.secondary" paragraph>
            Дата тренировки: {new Date(training.dayId).toLocaleDateString('ru-RU')}
          </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleAddExercise} sx={{ mt: 2 }}>
          Добавить упражнение +
        </Button>
        {showAddExerciseForm && <AddExerciseForm onSubmit={handleExerciseSubmit} />}
        {/* Здесь будет форма создания тренировочного плана */}
      </Box>
    </Container>
  );
};
