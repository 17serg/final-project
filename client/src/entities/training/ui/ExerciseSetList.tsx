import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import {
  ExerciseSetApi,
  ExerciseSet,
  CreateExerciseSetDto,
  UpdateExerciseSetDto,
} from '../api/ExerciseSetApi';
import { debounce } from 'lodash';

interface ExerciseSetListProps {
  exerciseOfTrainingId: number;
  plannedSets: number;
  plannedReps: number;
  plannedWeight: number;
}

const ExerciseSetList: React.FC<ExerciseSetListProps> = ({
  exerciseOfTrainingId,
  plannedReps,
  plannedWeight,
}) => {
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSet, setEditingSet] = useState<ExerciseSet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ExerciseSet>>({
    actualWeight: plannedWeight || 50,
    actualReps: plannedReps || 10,
    isCompleted: false,
    notes: '',
  });

  // Загрузка подходов при монтировании компонента
  useEffect(() => {
    fetchExerciseSets();
  }, [exerciseOfTrainingId]);

  // Изменяем обработчик для автоматического заполнения значений по умолчанию
  useEffect(() => {
    const updateEmptySets = async () => {
      try {
        const response = await ExerciseSetApi.getExerciseSets(exerciseOfTrainingId);
        const sets = response.data.data;

        // Обновляем каждый пустой сет значениями по умолчанию
        const updatePromises = sets.map(async (set) => {
          if (!set.actualWeight && !set.actualReps) {
            await ExerciseSetApi.updateExerciseSet(set.id, {
              actualWeight: plannedWeight,
              actualReps: plannedReps,
            });
          }
        });

        await Promise.all(updatePromises);
        await fetchExerciseSets(); // Перезагружаем сеты после обновления
      } catch (error) {
        console.error('Ошибка при обновлении подходов:', error);
        setError('Не удалось обновить подходы');
      }
    };

    updateEmptySets();
  }, [exerciseOfTrainingId, plannedWeight, plannedReps]);

  // Загрузка подходов
  const fetchExerciseSets = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ExerciseSetApi.getExerciseSets(exerciseOfTrainingId);

      if (response.data.success && Array.isArray(response.data.data)) {
        setExerciseSets(response.data.data);
        setError(null);
      } else {
        throw new Error('Неверный формат данных от сервера');
      }
    } catch (error) {
      console.error('Ошибка при загрузке подходов:', error);
      setError('Не удалось загрузить подходы');
      setExerciseSets([]); // Сбрасываем состояние в случае ошибки
    } finally {
      setLoading(false);
    }
  };

  // Открытие диалога для редактирования подхода
  const handleEditSet = (set: ExerciseSet): void => {
    setEditingSet(set);
    setFormData({
      actualWeight: set.actualWeight,
      actualReps: set.actualReps,
      isCompleted: set.isCompleted,
      notes: set.notes,
    });
    setIsDialogOpen(true);
  };

  // Изменяем обработчик создания нового подхода
  const handleSaveSet = async (): Promise<void> => {
    try {
      setIsSaving(true);
      if (editingSet) {
        // Обновление существующего подхода
        const updateData: UpdateExerciseSetDto = {
          actualWeight: formData.actualWeight ?? (plannedWeight || 50),
          actualReps: formData.actualReps ?? (plannedReps || 10),
          isCompleted: formData.isCompleted,
          notes: formData.notes || undefined,
        };
        await ExerciseSetApi.updateExerciseSet(editingSet.id, updateData);
      } else {
        // Создание нового подхода
        const createData: CreateExerciseSetDto = {
          setNumber: formData.setNumber as number,
          actualWeight: formData.actualWeight ?? (plannedWeight || 50),
          actualReps: formData.actualReps ?? (plannedReps || 10),
          isCompleted: formData.isCompleted,
          notes: formData.notes || undefined,
        };
        await ExerciseSetApi.createExerciseSet(exerciseOfTrainingId, createData);
      }
      await fetchExerciseSets();
      handleCloseDialog();
    } catch (error) {
      console.error('Ошибка при сохранении подхода:', error);
      setError('Не удалось сохранить подход');
    } finally {
      setIsSaving(false);
    }
  };

  // Изменяем начальное состояние formData
  const resetFormData = () => {
    setFormData({
      actualWeight: plannedWeight || 50,
      actualReps: plannedReps || 10,
      isCompleted: false,
      notes: '',
    });
  };

  // Обновляем handleCloseDialog
  const handleCloseDialog = (): void => {
    setIsDialogOpen(false);
    setEditingSet(null);
    resetFormData();
  };

  // Обработка изменений в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;

    // Проверка на отрицательные значения для числовых полей
    if (type === 'number' && (name === 'actualWeight' || name === 'actualReps')) {
      const numValue = parseFloat(value);
      if (value === '' || numValue >= 0) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // Удаление подхода
  const handleDeleteSet = async (id: number): Promise<void> => {
    // Находим подход, который пытаемся удалить
    const setToDelete = exerciseSets.find((set) => set.id === id);

    if (!setToDelete) return;

    // Проверяем, является ли подход последним в списке
    const isLastSet =
      setToDelete.setNumber === Math.max(...exerciseSets.map((set) => set.setNumber));

    if (!isLastSet) {
      setError('Можно удалить только последний подход');
      return;
    }

    setSetToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (setToDelete === null) return;

    try {
      // Удаляем подход с сервера
      await ExerciseSetApi.deleteExerciseSet(setToDelete);

      // Получаем обновленный список подходов
      const response = await ExerciseSetApi.getExerciseSets(exerciseOfTrainingId);

      if (response.data.success && Array.isArray(response.data.data)) {
        // Сортируем подходы по номеру
        const sortedSets = [...response.data.data].sort((a, b) => a.setNumber - b.setNumber);

        // Пересчитываем порядковые номера
        const updatedSets = sortedSets.map((set, index) => ({
          ...set,
          setNumber: index + 1,
        }));

        // Обновляем локальное состояние с пересчитанными номерами
        setExerciseSets(updatedSets);

        // Создаем новые подходы с обновленными номерами
        for (let i = 0; i < updatedSets.length; i++) {
          const set = updatedSets[i];
          const newSetNumber = i + 1;

          // Если номер изменился, создаем новый подход с правильным номером
          if (set.setNumber !== newSetNumber) {
            // Создаем новый подход с обновленным номером
            await ExerciseSetApi.createExerciseSet(exerciseOfTrainingId, {
              setNumber: newSetNumber,
              actualWeight: set.actualWeight || undefined,
              actualReps: set.actualReps || undefined,
              isCompleted: set.isCompleted,
              notes: set.notes || undefined,
            });

            // Удаляем старый подход
            await ExerciseSetApi.deleteExerciseSet(set.id);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при удалении подхода:', error);
      setError('Не удалось удалить подход');
    } finally {
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteDialogOpen(false);
    setSetToDelete(null);
  };

  // Оптимизированное обновление веса и повторений с debounce
  const debouncedUpdateSet = useCallback(
    debounce(async (setId: number, updateData: Partial<UpdateExerciseSetDto>) => {
      try {
        await ExerciseSetApi.updateExerciseSet(setId, updateData);
        // Обновляем локальное состояние без перезагрузки с сервера
        setExerciseSets((prevSets) =>
          prevSets.map((set) => (set.id === setId ? { ...set, ...updateData } : set)),
        );
      } catch (error) {
        console.error('Ошибка при обновлении подхода:', error);
      }
    }, 500),
    [],
  );

  // Оптимизированное обновление статуса выполнения
  const handleToggleCompleted = async (set: ExerciseSet): Promise<void> => {
    try {
      // Сначала обновляем UI
      setExerciseSets((prevSets) =>
        prevSets.map((s) => (s.id === set.id ? { ...s, isCompleted: !s.isCompleted } : s)),
      );

      // Затем отправляем запрос на сервер
      await ExerciseSetApi.updateExerciseSet(set.id, {
        isCompleted: !set.isCompleted,
      });
    } catch (error) {
      // В случае ошибки возвращаем предыдущее состояние
      setExerciseSets((prevSets) =>
        prevSets.map((s) => (s.id === set.id ? { ...s, isCompleted: set.isCompleted } : s)),
      );
      console.error('Ошибка при обновлении статуса подхода:', error);
      setError('Не удалось обновить статус подхода');
    }
  };

  const handleAddSet = async (): Promise<void> => {
    try {
      // Определяем следующий порядковый номер, учитывая существующие подходы
      const nextSetNumber =
        exerciseSets.length > 0 ? Math.max(...exerciseSets.map((set) => set.setNumber)) + 1 : 1;

      // Создаем новый подход с дефолтными значениями
      const newSet: CreateExerciseSetDto = {
        setNumber: nextSetNumber,
        actualWeight: plannedWeight || 50,
        actualReps: plannedReps || 10,
        isCompleted: false,
        notes: '',
      };

      // Оптимистичное обновление UI
      const optimisticSet: ExerciseSet = {
        id: Date.now(),
        exerciseOfTrainingId,
        setNumber: nextSetNumber,
        actualWeight: newSet.actualWeight || null,
        actualReps: newSet.actualReps || null,
        isCompleted: false,
        notes: '',
        executionDate: new Date().toISOString().split('T')[0],
        executionTime: new Date().toISOString().split('T')[1].substring(0, 5),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setExerciseSets((prevSets) => [...prevSets, optimisticSet]);

      // Отправка данных на сервер
      const response = await ExerciseSetApi.createExerciseSet(exerciseOfTrainingId, newSet);

      // Обновляем локальное состояние с реальными данными с сервера
      if (response.data.success) {
        const updatedSet: ExerciseSet = {
          ...response.data.data,
          setNumber: nextSetNumber,
        };

        setExerciseSets((prevSets) =>
          prevSets.map((set) => (set.id === optimisticSet.id ? updatedSet : set)),
        );
      }
    } catch (error) {
      console.error('Ошибка при добавлении подхода:', error);
      setError('Не удалось добавить подход');

      // Откатываем оптимистичное обновление в случае ошибки
      setExerciseSets((prevSets) => prevSets.filter((set) => set.id !== Date.now()));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '24px',
          overflow: 'hidden',
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Вес (кг)</TableCell>
              <TableCell>Повторения</TableCell>
              <TableCell>Выполнено</TableCell>
              <TableCell>Примечания</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exerciseSets.map((set) => (
              <TableRow key={set.id}>
                <TableCell>{set.setNumber}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={set.actualWeight || ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined;
                      // Обновляем локальное состояние немедленно
                      setExerciseSets((prevSets) =>
                        prevSets.map((s) => (s.id === set.id ? { ...s, actualWeight: value } : s)),
                      );
                      // Отправляем обновление на сервер с задержкой
                      debouncedUpdateSet(set.id, { actualWeight: value });
                    }}
                    inputProps={{ min: 0, step: 0.5 }}
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={set.actualReps || ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined;
                      // Обновляем локальное состояние немедленно
                      setExerciseSets((prevSets) =>
                        prevSets.map((s) => (s.id === set.id ? { ...s, actualReps: value } : s)),
                      );
                      // Отправляем обновление на сервер с задержкой
                      debouncedUpdateSet(set.id, { actualReps: value });
                    }}
                    inputProps={{ min: 0 }}
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={set.isCompleted}
                    onChange={() => handleToggleCompleted(set)}
                    sx={{
                      color: 'rgba(0, 0, 0, 0.3)',
                      '&.Mui-checked': {
                        color: 'rgb(76, 175, 80)',
                      },
                      '&:hover': {
                        color: 'rgba(76, 175, 80, 0.5)',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={set.notes || ''} placement="top" arrow>
                    <TextField
                      size="small"
                      value={set.notes || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Обновляем локальное состояние немедленно
                        setExerciseSets((prevSets) =>
                          prevSets.map((s) => (s.id === set.id ? { ...s, notes: value } : s)),
                        );
                        // Отправляем обновление на сервер с задержкой
                        debouncedUpdateSet(set.id, { notes: value });
                      }}
                      sx={{ width: '200px' }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  {set.setNumber === Math.max(...exerciseSets.map((s) => s.setNumber)) && (
                    <Tooltip title="Удалить">
                      <IconButton size="small" onClick={() => handleDeleteSet(set.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editingSet ? 'Редактировать подход' : 'Добавить подход'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Вес (кг)"
                name="actualWeight"
                type="number"
                value={formData.actualWeight || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Повторения"
                name="actualReps"
                type="number"
                value={formData.actualReps || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={formData.isCompleted}
                  onChange={handleInputChange}
                  name="isCompleted"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.3)',
                    '&.Mui-checked': {
                      color: 'rgb(76, 175, 80)',
                    },
                    '&:hover': {
                      color: 'rgba(76, 175, 80, 0.5)',
                    },
                  }}
                />
                <Typography>Выполнено</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Примечания"
                name="notes"
                multiline
                rows={2}
                value={formData.notes || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSaveSet} variant="contained" color="primary" disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background:
              'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
            backdropFilter: 'blur(9px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
            border: '2px solid rgba(161, 161, 161, 0.93)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
            Вы уверены, что хотите удалить этот подход? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
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

      <Button
        variant="contained"
        onClick={handleAddSet}
        sx={{
          mt: 2,
          py: 1,
          px: 2,
          fontSize: '0.9rem',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
          },
        }}
        startIcon={<AddIcon />}
      >
        Добавить подход
      </Button>
    </Box>
  );
};

export default ExerciseSetList;
