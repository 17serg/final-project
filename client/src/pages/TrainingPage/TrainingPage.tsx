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
        py: 4,
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
        backdropFilter: 'blur(9px)',
        borderRadius: '24px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        border: '2px solid rgba(161, 161, 161, 0.93)',
        padding: '24px',
        marginBottom: '34px',
        }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.9)',
              fontWeight: 'bold',
            }}
          >
            Тренировочный план
          </Typography>
          <Button
            variant="contained"
            onClick={handleNavigateToCalendar}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              py: 1,
              px: 2,
              fontSize: '0.9rem',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              minWidth: 'auto',
            }}
          >
            ◀ Вернуться в календарь
          </Button>
        </Box>

        {training && training.day && (
          <Typography
            variant="body1"
            paragraph
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: '1.2rem',
            }}
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

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 3,
          gap: 2,
        }}>
          <Button 
            variant="contained" 
            onClick={handleAddExercise}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              py: 1.5,
              px: 3,
              fontSize: '1.1rem',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            Добавить упражнение +
          </Button>

          {training && exercises.length > 0 && (
            <Button
              variant="contained"
              onClick={training.complete ? handleCancelTraining : handleCompleteTraining}
              disabled={isUpdating}
              sx={{
                backgroundColor: training.complete ? 'rgba(211, 47, 47, 0.9)' : 'rgba(73, 124, 59, 0.9)',
                color: 'white',
                '&:hover': {
                  backgroundColor: training.complete ? 'rgba(211, 47, 47, 0.7)' : 'rgb(86, 146, 71)',
                },
                py: 1.5,
                px: 3,
                fontSize: '1.1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              {training.complete ? 'Отменить выполнение' : 'Тренировка выполнена'}
            </Button>
          )}
        </Box>

        {showAddExerciseForm && <AddExerciseForm onSubmit={handleExerciseSubmit} />}

        {/* Диалог подтверждения отмены выполнения */}
        <Dialog 
          open={confirmDialog.open} 
          onClose={() => setConfirmDialog({ open: false })}
          PaperProps={{
            sx: {
              borderRadius: '24px',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
              backdropFilter: 'blur(9px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              border: '2px solid rgba(161, 161, 161, 0.93)',
            }
          }}
        >
          <DialogTitle sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>
            Подтверждение
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
              Вы уверены, что хотите отменить выполнение тренировки? Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setConfirmDialog({ open: false })}
              sx={{
                color: 'rgba(0, 0, 0, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleConfirmCancel} 
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.9)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.7)',
                },
                py: 1,
                px: 2,
                borderRadius: '12px',
              }}
            >
              Подтвердить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог подтверждения удаления упражнения */}
        <Dialog
          open={deleteConfirmDialog.open}
          onClose={() => setDeleteConfirmDialog({ open: false, exerciseId: null })}
          PaperProps={{
            sx: {
              borderRadius: '24px',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
              backdropFilter: 'blur(9px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              border: '2px solid rgba(161, 161, 161, 0.93)',
            }
          }}
        >
          <DialogTitle sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>
            Подтверждение удаления
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
              Вы уверены, что хотите удалить это упражнение? Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteConfirmDialog({ open: false, exerciseId: null })}
              sx={{
                color: 'rgba(0, 0, 0, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.9)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.7)',
                },
                py: 1,
                px: 2,
                borderRadius: '12px',
              }}
            >
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
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'rgba(0, 0, 0, 0.9)',
              '& .MuiAlert-icon': {
                color: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
