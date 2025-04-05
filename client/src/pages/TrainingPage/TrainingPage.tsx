import { Box, Container, Typography, Button } from '@mui/material';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { TrainingApi, ExerciseOfTraining } from '@/entities/training/api/TrainingApi';
import AddExerciseForm from '@/entities/training/ui/AddExerciseForm';
import ExerciseList from '@/entities/training/ui/ExerciseList';

export const TrainingPage = (): React.ReactElement => {
  const { trainingId } = useParams();
  const [training, setTraining] = useState<{ dayId: number } | null>(null);
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  const [exercises, setExercises] = useState<ExerciseOfTraining[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

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

  useEffect(() => {
    const fetchExercises = async (): Promise<void> => {
      if (trainingId) {
        try {
          const response = await TrainingApi.getExercisesOfTraining(Number(trainingId));
          setExercises(response.data);
        } catch (error) {
          console.error('Ошибка при получении упражнений:', error);
        }
      }
    };

    fetchExercises();
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

      // Обновляем список упражнений после добавления
      const response = await TrainingApi.getExercisesOfTraining(Number(trainingId));
      setExercises(response.data);

      setShowAddExerciseForm(false);
    } catch (error) {
      console.error('Ошибка при добавлении упражнения:', error);
    }
  };

  const handleMoveExercise = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= exercises.length || isUpdating) return;

    try {
      setIsUpdating(true);

      // Создаем новый массив с измененным порядком
      const newExercises = [...exercises];
      const [movedExercise] = newExercises.splice(fromIndex, 1);
      newExercises.splice(toIndex, 0, movedExercise);

      // Обновляем состояние для мгновенного отображения изменений
      setExercises(newExercises);

      // Получаем массив ID упражнений в новом порядке
      const exerciseIds = newExercises.map((exercise) => exercise.id);

      // Отправляем запрос на сервер для сохранения нового порядка
      await TrainingApi.updateExercisesOrder(Number(trainingId), exerciseIds);
    } catch (error) {
      console.error('Ошибка при обновлении порядка упражнений:', error);

      // В случае ошибки восстанавливаем исходный порядок
      const response = await TrainingApi.getExercisesOfTraining(Number(trainingId));
      setExercises(response.data);
    } finally {
      setIsUpdating(false);
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

        <ExerciseList exercises={exercises} onMoveExercise={handleMoveExercise} />

        <Button variant="contained" color="primary" onClick={handleAddExercise} sx={{ mt: 2 }}>
          Добавить упражнение +
        </Button>
        {showAddExerciseForm && <AddExerciseForm onSubmit={handleExerciseSubmit} />}
      </Box>
    </Container>
  );
};
