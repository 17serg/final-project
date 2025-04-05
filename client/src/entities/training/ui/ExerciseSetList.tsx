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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
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
  plannedSets,
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
  const fetchExerciseSets = async () => {
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

  // Открытие диалога для создания нового подхода
  const handleAddSet = () => {
    const nextSetNumber = exerciseSets.length + 1;
    setEditingSet(null);
    setFormData({
      setNumber: nextSetNumber,
      actualWeight: plannedWeight,
      actualReps: plannedReps,
      isCompleted: false,
      notes: '',
    });
    setIsDialogOpen(true);
  };

  // Открытие диалога для редактирования подхода
  const handleEditSet = (set: ExerciseSet) => {
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
  const handleCloseDialog = () => {
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Сохранение подхода
  const handleSaveSet = async () => {
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
  const handleDeleteSet = async (id: number) => {
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
  const handleToggleCompleted = async (set: ExerciseSet) => {
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

  // Создание всех подходов сразу
  const handleCreateAllSets = async () => {
    try {
      setIsSaving(true);
      const sets: CreateExerciseSetDto[] = [];
      for (let i = 1; i <= plannedSets; i++) {
        sets.push({
          setNumber: i,
          actualWeight: plannedWeight,
          actualReps: plannedReps,
          isCompleted: false,
        });
      }
      await ExerciseSetApi.createMultipleExerciseSets(exerciseOfTrainingId, { sets });
      await fetchExerciseSets();
    } catch (error) {
      console.error('Ошибка при создании подходов:', error);
      setError('Не удалось создать подходы');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ my: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Подходы</Typography>
        <Box>
          {exerciseSets.length === 0 && (
            <Button
              variant="outlined"
              onClick={handleCreateAllSets}
              disabled={isSaving}
              sx={{ mr: 1 }}
            >
              {isSaving ? <CircularProgress size={24} /> : 'Создать все подходы'}
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSet}
            disabled={isSaving}
          >
            Добавить подход
          </Button>
        </Box>
      </Box>

      {exerciseSets.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Нет подходов. Добавьте подходы или создайте все подходы сразу.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell align="center">Выполнен</TableCell>
                <TableCell align="right">Вес (кг)</TableCell>
                <TableCell align="right">Повторения</TableCell>
                <TableCell>Заметки</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exerciseSets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell>{set.setNumber}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={set.isCompleted ? 'Выполнен' : 'Не выполнен'}>
                      <Checkbox
                        checked={set.isCompleted}
                        onChange={() => handleToggleCompleted(set)}
                        color="primary"
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{set.actualWeight || '-'}</TableCell>
                  <TableCell align="right">{set.actualReps || '-'}</TableCell>
                  <TableCell>{set.notes || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditSet(set)} disabled={isSaving}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteSet(set.id)}
                      disabled={isSaving}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Диалог для создания/редактирования подхода */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSet ? 'Редактировать подход' : 'Добавить подход'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {!editingSet && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Номер подхода: {formData.setNumber}</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Вес (кг)"
                name="actualWeight"
                type="number"
                value={formData.actualWeight || ''}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Повторения"
                name="actualReps"
                type="number"
                value={formData.actualReps || ''}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Заметки"
                name="notes"
                multiline
                rows={2}
                value={formData.notes || ''}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={formData.isCompleted || false}
                  onChange={handleInputChange}
                  name="isCompleted"
                  disabled={isSaving}
                />
                <Typography>Выполнен</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSaving}>
            Отмена
          </Button>
          <Button
            onClick={handleSaveSet}
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExerciseSetList;
