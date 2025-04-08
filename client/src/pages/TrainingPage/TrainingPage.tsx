import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { TrainingApi, ExerciseOfTraining } from '@/entities/training/api/TrainingApi';
import AddExerciseForm from '@/entities/training/ui/AddExerciseForm';
import ExerciseList from '@/entities/training/ui/ExerciseList';

export const TrainingPage = (): React.ReactElement => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<{
    id: number;
    dayId: number;
    complete: boolean;
    day?: {
      date: string;
    };
  } | null>(null);
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  const [exercises, setExercises] = useState<ExerciseOfTraining[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean }>({
    open: false,
  });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    exerciseId: number | null;
  }>({
    open: false,
    exerciseId: null,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

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

  const handleMoveExercise = async (fromIndex: number, toIndex: number): Promise<void> => {
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

  const handleCompleteTraining = async (): Promise<void> => {
    if (!trainingId) return;

    try {
      setIsUpdating(true);
      await TrainingApi.updateTrainingStatus(Number(trainingId), true);

      // Обновляем состояние тренировки
      const response = await TrainingApi.getTrainingById(Number(trainingId));
      setTraining(response.data);

      setSnackbar({
        open: true,
        message: 'Тренировка отмечена как выполненная',
        severity: 'success',
      });
    } catch (error) {
      console.error('Ошибка при обновлении статуса тренировки:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось обновить статус тренировки',
        severity: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelTraining = (): void => {
    setConfirmDialog({ open: true });
  };

  const handleConfirmCancel = async (): Promise<void> => {
    if (!trainingId) return;

    try {
      setIsUpdating(true);
      await TrainingApi.updateTrainingStatus(Number(trainingId), false);

      // Обновляем состояние тренировки
      const response = await TrainingApi.getTrainingById(Number(trainingId));
      setTraining(response.data);

      setSnackbar({
        open: true,
        message: 'Статус тренировки отменен',
        severity: 'success',
      });
    } catch (error) {
      console.error('Ошибка при обновлении статуса тренировки:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось обновить статус тренировки',
        severity: 'error',
      });
    } finally {
      setIsUpdating(false);
      setConfirmDialog({ open: false });
    }
  };

  const handleCloseConfirmDialog = (): void => {
    setConfirmDialog({ open: false });
  };

  const handleCloseSnackbar = (): void => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleNavigateToCalendar = (): void => {
    navigate('/profile', { state: { scrollToCalendar: true } });
  };

  const handleDeleteExercise = async (exerciseId: number): Promise<void> => {
    setDeleteConfirmDialog({ open: true, exerciseId });
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (deleteConfirmDialog.exerciseId === null) return;

    try {
      await TrainingApi.deleteExerciseOfTraining(deleteConfirmDialog.exerciseId);
      setExercises(exercises.filter((ex) => ex.id !== deleteConfirmDialog.exerciseId));

      setSnackbar({
        open: true,
        message: 'Упражнение удалено',
        severity: 'success',
      });
    } catch (error) {
      console.error('Ошибка при удалении упражнения:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось удалить упражнение',
        severity: 'error',
      });
    } finally {
      setDeleteConfirmDialog({ open: false, exerciseId: null });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 3,
         
        }}>
        <Button
          variant="contained"
          onClick={handleNavigateToCalendar}
          sx={{
            backgroundColor: 'rgb(42, 41, 223)',
            '&:hover': {
              backgroundColor: 'rgba(42, 41, 223, 0.8)',
            },
          }}
        >
          ◀ Вернуться в календарь
        </Button>
      </Box>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center',color: 'white' }}>
          Тренировочный план
        </Typography>

        {training && training.day && (
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Дата:{' '}
            {new Date(training.day.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
        )}

        <ExerciseList
          exercises={exercises}
          onMoveExercise={handleMoveExercise}
          onDeleteExercise={handleDeleteExercise}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleAddExercise}>
            Добавить упражнение +
          </Button>

          {training && exercises.length > 0 && (
            <Button
              variant="contained"
              color={training.complete ? 'error' : 'success'}
              onClick={training.complete ? handleCancelTraining : handleCompleteTraining}
              disabled={isUpdating}
              sx={
                training.complete
                  ? {
                      bgcolor: 'rgba(211, 47, 47, 0.8)',
                      '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.9)' },
                    }
                  : {}
              }
            >
              {training.complete ? 'Отменить выполнение' : 'Тренировка выполнена'}
            </Button>
          )}
        </Box>

        {showAddExerciseForm && <AddExerciseForm onSubmit={handleExerciseSubmit} />}

        {/* Диалог подтверждения отмены выполнения */}
        <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false })}>
          <DialogTitle>Подтверждение</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите отменить выполнение тренировки? Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ open: false })}>Отмена</Button>
            <Button onClick={handleConfirmCancel} color="error" variant="contained">
              Подтвердить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог подтверждения удаления упражнения */}
        <Dialog
          open={deleteConfirmDialog.open}
          onClose={() => setDeleteConfirmDialog({ open: false, exerciseId: null })}
        >
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить это упражнение? Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmDialog({ open: false, exerciseId: null })}>
              Отмена
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Снэкбар для уведомлений */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
