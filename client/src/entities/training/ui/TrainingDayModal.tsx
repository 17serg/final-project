import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  AlertColor,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '@/entities/user/provider/UserProvider';
import { DayApi } from '@/entities/day/api/DayApi';
import { TrainingApi, ExerciseOfTraining } from '../api/TrainingApi';
import { Day } from '@/entities/day/model/types';
import { FitnessCenter, CheckCircle, Error, Info, Delete } from '@mui/icons-material';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

interface TrainingDayModalProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  dayId?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`training-tabpanel-${index}`}
      aria-labelledby={`training-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

interface Training {
  id: number;
  complete: boolean;
  createdAt: string;
}

const TrainingDayModal = ({ open, onClose, date, dayId }: TrainingDayModalProps) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as UserContextType;
  const [day, setDay] = useState<Day | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [isLoadingTraining, setIsLoadingTraining] = useState(false);
  const [exercisesMap, setExercisesMap] = useState<Record<number, ExerciseOfTraining[]>>({});
  const [isLoadingExercises, setIsLoadingExercises] = useState<Record<number, boolean>>({});
  const [selectedTrainingIndex, setSelectedTrainingIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchDayAndTrainings = async () => {
      if (!user) return;
      try {
        setError(null);
        let foundDay: Day | null = null;

        if (dayId) {
          const response = await DayApi.getDayById(dayId);
          foundDay = response.data;

          // Проверяем наличие тренировок для этого дня
          setIsLoadingTraining(true);
          try {
            const trainingResponse = await TrainingApi.getTrainingsByDayId(dayId);
            setTrainings(trainingResponse.data);
            console.log('Найдены тренировки:', trainingResponse.data);

            // Загружаем упражнения для каждой тренировки
            if (trainingResponse.data && trainingResponse.data.length > 0) {
              const exercisesPromises = trainingResponse.data.map(async (training: Training) => {
                setIsLoadingExercises((prev) => ({ ...prev, [training.id]: true }));
                try {
                  const exercisesResponse = await TrainingApi.getExercisesOfTraining(training.id);
                  setExercisesMap((prev) => ({ ...prev, [training.id]: exercisesResponse.data }));
                  console.log(
                    `Загружены упражнения для тренировки ${training.id}:`,
                    exercisesResponse.data,
                  );
                } catch (error) {
                  console.error(
                    `Ошибка при загрузке упражнений для тренировки ${training.id}:`,
                    error,
                  );
                  setExercisesMap((prev) => ({ ...prev, [training.id]: [] }));
                } finally {
                  setIsLoadingExercises((prev) => ({ ...prev, [training.id]: false }));
                }
              });
              await Promise.all(exercisesPromises);
            }
          } catch (error) {
            // Если тренировки не найдены, это нормально
            setTrainings([]);
            console.log('Тренировки не найдены для дня:', dayId);
          } finally {
            setIsLoadingTraining(false);
          }
        } else {
          const response = await DayApi.getDaysByMonth(date, user.id);
          foundDay =
            response.data.find(
              (d: Day) => new Date(d.date).toDateString() === date.toDateString(),
            ) || null;

          if (foundDay) {
            // Проверяем наличие тренировок для найденного дня
            setIsLoadingTraining(true);
            try {
              const trainingResponse = await TrainingApi.getTrainingsByDayId(foundDay.id);
              setTrainings(trainingResponse.data);
              console.log('Найдены тренировки:', trainingResponse.data);

              // Загружаем упражнения для каждой тренировки
              if (trainingResponse.data && trainingResponse.data.length > 0) {
                const exercisesPromises = trainingResponse.data.map(async (training: Training) => {
                  setIsLoadingExercises((prev) => ({ ...prev, [training.id]: true }));
                  try {
                    const exercisesResponse = await TrainingApi.getExercisesOfTraining(training.id);
                    setExercisesMap((prev) => ({ ...prev, [training.id]: exercisesResponse.data }));
                    console.log(
                      `Загружены упражнения для тренировки ${training.id}:`,
                      exercisesResponse.data,
                    );
                  } catch (error) {
                    console.error(
                      `Ошибка при загрузке упражнений для тренировки ${training.id}:`,
                      error,
                    );
                    setExercisesMap((prev) => ({ ...prev, [training.id]: [] }));
                  } finally {
                    setIsLoadingExercises((prev) => ({ ...prev, [training.id]: false }));
                  }
                });
                await Promise.all(exercisesPromises);
              }
            } catch (error) {
              // Если тренировки не найдены, это нормально
              setTrainings([]);
              console.log('Тренировки не найдены для дня:', foundDay.id);
            } finally {
              setIsLoadingTraining(false);
            }
          }
        }

        console.log('Найденный день:', foundDay);
        setDay(foundDay);
      } catch (error) {
        console.error('Ошибка при получении дня:', error);
        setError('Не удалось загрузить информацию о дне');
      }
    };

    if (open) {
      fetchDayAndTrainings();
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

  const handleGoToExistingTraining = (trainingId: number) => {
    navigate(CLIENT_ROUTES.TRAINING.replace(':trainingId', trainingId.toString()));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTrainingIndex(newValue);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteClick = (training: Training) => {
    setTrainingToDelete(training);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!trainingToDelete) return;

    setIsDeleting(true);
    try {
      await TrainingApi.deleteTraining(trainingToDelete.id);

      // Обновляем список тренировок
      setTrainings((prev) => prev.filter((t) => t.id !== trainingToDelete.id));

      // Обновляем индекс выбранной тренировки
      if (selectedTrainingIndex >= trainings.length - 1) {
        setSelectedTrainingIndex(Math.max(0, trainings.length - 2));
      }

      // Показываем уведомление об успешном удалении
      setSnackbar({
        open: true,
        message: 'Тренировка успешно удалена',
        severity: 'success',
      });
    } catch (error) {
      console.error('Ошибка при удалении тренировки:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось удалить тренировку',
        severity: 'error',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTrainingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTrainingToDelete(null);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="training-day-modal">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            background: 'linear-gradient(to bottom, rgba(211, 211, 211, 0.29), rgba(133, 133, 133, 0.09) 70%)',
            transition: "all 0.3s ease",
            backdropFilter: "blur(20px)",
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              backgroundColor: 'rgba(80, 80, 80, 0.75)', 
              borderRadius: '16px 16px 0px 0px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <FitnessCenter sx={{ color: 'white' }} />
            <Typography variant="h6" component="h2">
              Тренировочный день
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
              {date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {isLoadingTraining ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
              </Box>
            ) : trainings.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Info color="info" fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Найдено {trainings.length} {trainings.length === 1 ? 'тренировка' : 'тренировки'}
                  </Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }}>
                  <Tabs
                    value={selectedTrainingIndex}
                    onChange={handleTabChange}
                    aria-label="тренировки"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-selected': {
                          color: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    {[...trainings].reverse().map((training, index) => (
                      <Tab
                        key={training.id}
                        label={`Тренировка ${index + 1}`}
                        id={`training-tab-${index}`}
                        aria-controls={`training-tabpanel-${index}`}
                      />
                    ))}
                  </Tabs>
                </Box>

                {[...trainings].reverse().map((training, index) => (
                  <TabPanel key={training.id} value={selectedTrainingIndex} index={index}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {training.complete ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Error color="warning" />
                        )}
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {training.complete ? 'Тренировка выполнена' : 'Тренировка не выполнена'}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(training)}
                          sx={{ ml: 'auto' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Создана: {formatDate(training.createdAt)}
                      </Typography>
                    </Box>

                    {isLoadingExercises[training.id] ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                      </Box>
                    ) : exercisesMap[training.id] && exercisesMap[training.id].length > 0 ? (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.9)' }}>
                          Упражнения в тренировке:
                        </Typography>
                        <TableContainer 
                          component={Paper} 
                          sx={{ 
                            maxHeight: 300,
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            '& .MuiTableCell-root': {
                              color: 'rgba(255, 255, 255, 0.9)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '& .MuiTableHead-root .MuiTableCell-root': {
                              fontWeight: 'bold',
                            }
                          }}
                        >
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell align="right">Вес (кг)</TableCell>
                                <TableCell align="right">Подходы</TableCell>
                                <TableCell align="right">Повторения</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {exercisesMap[training.id].map((exercise, index) => (
                                <TableRow key={exercise.id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{exercise.Exercise.name}</TableCell>
                                  <TableCell align="right">{exercise.weight}</TableCell>
                                  <TableCell align="right">{exercise.sets}</TableCell>
                                  <TableCell align="right">{exercise.reps}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                        В тренировке пока нет упражнений
                      </Typography>
                    )}

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleGoToExistingTraining(training.id)}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.8)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      Перейти к тренировке
                    </Button>
                  </TabPanel>
                ))}
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Для этого дня еще не создано ни одной тренировки
                </Typography>
              </Box>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={handleGoToTraining}
                disabled={!day || !day.id}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  backgroundColor: 'rgba(128, 128, 128, 0.9)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(128, 128, 128, 0.7)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(128, 128, 128, 0.5)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                Создать новую тренировку
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.29), rgba(143, 141, 141, 0.11) 70%)',
            backdropFilter: "blur(20px)",
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle 
          id="delete-dialog-title"
          sx={{ 
            backgroundColor: 'rgba(80, 80, 80, 0.75)', 
            borderRadius: '16px 16px 0px 0px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Подтверждение удаления
        </DialogTitle>
        <DialogContent sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography>
            Вы уверены, что хотите удалить эту тренировку? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleDeleteCancel} 
            disabled={isDeleting}
            sx={{ 
              color: 'rgba(167, 167, 167, 0.9)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            sx={{ 
              backgroundColor: 'rgba(211, 47, 47, 0.9)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.7)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
              }
            }}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar для уведомлений */}
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
    </>
  );
};

export default TrainingDayModal;
