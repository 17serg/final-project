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
  const [formData, setFormData] = useState<Partial<ExerciseSet>>({
    actualWeight: plannedWeight,
    actualReps: plannedReps,
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
      setExerciseSets(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке подходов:', error);
      setError('Не удалось загрузить подходы');
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
          actualWeight: formData.actualWeight ?? plannedWeight, // Используем значение по умолчанию
          actualReps: formData.actualReps ?? plannedReps, // Используем значение по умолчанию
          isCompleted: formData.isCompleted,
          notes: formData.notes || undefined,
        };
        await ExerciseSetApi.updateExerciseSet(editingSet.id, updateData);
      } else {
        // Создание нового подхода
        const createData: CreateExerciseSetDto = {
          setNumber: formData.setNumber as number,
          actualWeight: formData.actualWeight ?? plannedWeight, // Используем значение по умолчанию
          actualReps: formData.actualReps ?? plannedReps, // Используем значение по умолчанию
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
      actualWeight: plannedWeight,
      actualReps: plannedReps,
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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Удаление подхода
  const handleDeleteSet = async (id: number): Promise<void> => {
    if (window.confirm('Вы уверены, что хотите удалить этот подход?')) {
      try {
        await ExerciseSetApi.deleteExerciseSet(id);
        await fetchExerciseSets();
      } catch (error) {
        console.error('Ошибка при удалении подхода:', error);
        setError('Не удалось удалить подход');
      }
    }
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

  const handleAddSet = async () => {
    try {
      const newSetNumber = exerciseSets.length + 1;
      const newSet = {
        setNumber: newSetNumber,
        actualWeight: plannedWeight,
        actualReps: plannedReps,
        isCompleted: false,
      };

      // Оптимистичное обновление UI
      setExerciseSets((prev) => [...prev, { ...newSet, id: Date.now() }]);

      await ExerciseSetApi.createExerciseSet(exerciseOfTrainingId, newSet);

      // Тихое обновление данных с сервера
      const response = await ExerciseSetApi.getExerciseSets(exerciseOfTrainingId);
      setExerciseSets(response.data);
    } catch (error) {
      console.error('Ошибка при добавлении подхода:', error);
      setError('Не удалось добавить подход');
      // Возвращаем предыдущее состояние в случае ошибки
      await fetchExerciseSets();
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
      <TableContainer component={Paper}>
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
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={set.notes || ''}
                    onChange={(e) => {
                      ExerciseSetApi.updateExerciseSet(set.id, { notes: e.target.value })
                        .then(() => fetchExerciseSets())
                        .catch((error) =>
                          console.error('Ошибка при обновлении примечаний:', error),
                        );
                    }}
                    sx={{ width: '200px' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Редактировать">
                    <IconButton size="small" onClick={() => handleEditSet(set)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton size="small" onClick={() => handleDeleteSet(set.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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

      <Button variant="outlined" onClick={handleAddSet} sx={{ mt: 2 }} startIcon={<AddIcon />}>
        Добавить подход
      </Button>
    </Box>
  );
};

export default ExerciseSetList;
