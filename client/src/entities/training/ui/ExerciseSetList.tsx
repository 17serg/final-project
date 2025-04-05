import React, { useState, useEffect } from 'react';
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
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  ExerciseSetApi,
  ExerciseSet,
  CreateExerciseSetDto,
  UpdateExerciseSetDto,
} from '../api/ExerciseSetApi';

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

  // Закрытие диалога
  const handleCloseDialog = (): void => {
    setIsDialogOpen(false);
    setEditingSet(null);
    setFormData({
      actualWeight: plannedWeight,
      actualReps: plannedReps,
      isCompleted: false,
      notes: '',
    });
  };

  // Обработка изменений в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Сохранение подхода
  const handleSaveSet = async (): Promise<void> => {
    try {
      setIsSaving(true);
      if (editingSet) {
        // Обновление существующего подхода
        const updateData: UpdateExerciseSetDto = {
          actualWeight: formData.actualWeight ? Number(formData.actualWeight) : undefined,
          actualReps: formData.actualReps ? Number(formData.actualReps) : undefined,
          isCompleted: formData.isCompleted,
          notes: formData.notes || undefined,
        };
        await ExerciseSetApi.updateExerciseSet(editingSet.id, updateData);
      } else {
        // Создание нового подхода
        const createData: CreateExerciseSetDto = {
          setNumber: formData.setNumber as number,
          actualWeight: formData.actualWeight ? Number(formData.actualWeight) : undefined,
          actualReps: formData.actualReps ? Number(formData.actualReps) : undefined,
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

  // Быстрое обновление статуса выполнения
  const handleToggleCompleted = async (set: ExerciseSet): Promise<void> => {
    try {
      await ExerciseSetApi.updateExerciseSet(set.id, {
        isCompleted: !set.isCompleted,
      });
      await fetchExerciseSets();
    } catch (error) {
      console.error('Ошибка при обновлении статуса подхода:', error);
      setError('Не удалось обновить статус подхода');
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
                      ExerciseSetApi.updateExerciseSet(set.id, { actualWeight: value })
                        .then(() => fetchExerciseSets())
                        .catch((error) => console.error('Ошибка при обновлении веса:', error));
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
                      ExerciseSetApi.updateExerciseSet(set.id, { actualReps: value })
                        .then(() => fetchExerciseSets())
                        .catch((error) =>
                          console.error('Ошибка при обновлении повторений:', error),
                        );
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
    </Box>
  );
};

export default ExerciseSetList;
