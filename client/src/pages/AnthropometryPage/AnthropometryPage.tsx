import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { AnthropometryApi } from '@/entities/anthropometry/api/AnthropometryApi';
import { IAnthropometry } from '@/entities/anthropometry/model';
import { useUser } from '@/entities/user/hooks/useUser';
import { fonts } from '@/shared/styles/fonts';

export default function AnthropometryPage(): React.JSX.Element {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState<IAnthropometry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<IAnthropometry | null>(null);
  const [formData, setFormData] = useState<IAnthropometry>({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    chest: '',
    waist: '',
    hips: '',
    userId: user?.id || 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState<IAnthropometry | null>(null);

  useEffect(() => {
    loadMeasurements();
  }, [user]);

  const loadMeasurements = async (): Promise<void> => {
    try {
      const data = await AnthropometryApi.getMeasurements();
      console.log('Полученные данные антропометрии:', data);

      // Преобразуем поле breast в chest для отображения
      const transformedData = data.map((item) => {
        console.log('Обработка элемента:', item);
        const transformed = {
          ...item,
          chest: item.breast !== undefined ? item.breast : item.chest,
        };
        console.log('Преобразованный элемент:', transformed);
        return transformed;
      });

      // Сортируем замеры от старых к новым
      const sortedData = transformedData.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });

      console.log('Итоговые данные после преобразования:', sortedData);
      setMeasurements(sortedData || []);
    } catch (error) {
      console.error('Ошибка при загрузке замеров:', error);
      setMeasurements([]);
      setError('Не удалось загрузить замеры. Пожалуйста, попробуйте позже.');
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prev: IAnthropometry) => ({
      ...prev,
      [name]: name === 'date' ? value : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      // Проверка на валидность данных
      if (!formData.date || !formData.weight || !formData.height) {
        setError('Пожалуйста, заполните все обязательные поля корректными значениями.');
        setOpenSnackbar(true);
        return;
      }

      console.log('Отправляемые данные формы:', formData);
      console.log('Дата перед отправкой:', formData.date, 'тип:', typeof formData.date);

      // Преобразуем строковые значения в числа перед отправкой
      const dataToSubmit = {
        ...formData,
        weight:
          typeof formData.weight === 'string' ? parseFloat(formData.weight) || 0 : formData.weight,
        height:
          typeof formData.height === 'string' ? parseFloat(formData.height) || 0 : formData.height,
        chest:
          typeof formData.chest === 'string' ? parseFloat(formData.chest) || 0 : formData.chest,
        waist:
          typeof formData.waist === 'string' ? parseFloat(formData.waist) || 0 : formData.waist,
        hips: typeof formData.hips === 'string' ? parseFloat(formData.hips) || 0 : formData.hips,
      };

      console.log('Данные для отправки на сервер:', dataToSubmit);

      await AnthropometryApi.addMeasurement(dataToSubmit);
      await loadMeasurements();
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        chest: '',
        waist: '',
        hips: '',
        userId: user?.id || 0,
      });
    } catch (error) {
      console.error('Ошибка при добавлении замера:', error);
      setError('Не удалось добавить замер. Пожалуйста, попробуйте позже.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const handleDeleteClick = (measurement: IAnthropometry): void => {
    setMeasurementToDelete(measurement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!measurementToDelete || !measurementToDelete.id) return;

    try {
      await AnthropometryApi.deleteMeasurement(measurementToDelete.id);
      await loadMeasurements();
      setDeleteDialogOpen(false);
      setMeasurementToDelete(null);
    } catch (error) {
      console.error('Ошибка при удалении замера:', error);
      setError('Не удалось удалить замер. Пожалуйста, попробуйте позже.');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
    setMeasurementToDelete(null);
  };

  const formatDate = (dateValue: string | number): string => {
    console.log('Форматирование даты, входное значение:', dateValue, 'тип:', typeof dateValue);

    try {
      let date: Date;

      // Если dateValue - это число (timestamp)
      if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      }
      // Если dateValue - это строка в формате YYYY-MM-DD
      else if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        const [year, month, day] = dateValue.split('-').map(Number);
        date = new Date(year, month - 1, day);
      }
      // Если dateValue - это строка в формате ISO
      else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        console.error('Неизвестный формат даты:', dateValue);
        return 'Дата не указана';
      }

      // Проверяем, что дата валидна
      if (isNaN(date.getTime())) {
        console.error('Некорректная дата:', dateValue);
        return 'Дата не указана';
      }

      // Форматируем дату в DD.MM.YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      const formattedDate = `${day}.${month}.${year}`;
      console.log('Отформатированная дата:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('Ошибка при форматировании даты:', error);
      return 'Дата не указана';
    }
  };

  const handleAddMeasurement = (): void => {
    if (measurements && measurements.length > 0) {
      // Сортируем замеры по дате в порядке убывания (самый новый первый)
      const sortedMeasurements = [...measurements].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

      // Берем самый последний замер
      const lastMeasurement = sortedMeasurements[0];

      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: lastMeasurement.weight,
        height: lastMeasurement.height,
        chest: lastMeasurement.chest || '',
        waist: lastMeasurement.waist || '',
        hips: lastMeasurement.hips || '',
        userId: user?.id || 0,
      });
    } else {
      // Если замеров нет, используем пустые значения
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        chest: '',
        waist: '',
        hips: '',
        userId: user?.id || 0,
      });
    }
    setShowForm(true);
  };

  const calculateDifference = (current: number, previous: number): string | null => {
    if (!current || !previous) return null;
    const diff = Math.round(current - previous);
    if (diff === 0) return null;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  const getDifferenceColor = (diff: string | null): string => {
    if (!diff) return '';
    return diff.startsWith('+') ? 'rgb(76, 175, 80)' : 'rgb(244, 67, 54)';
  };

  const handleMeasurementClick = (measurement: IAnthropometry): void => {
    setSelectedMeasurement(measurement);
  };

  const handleCloseComparison = (): void => {
    setSelectedMeasurement(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, color: 'white', textAlign: 'center', ...fonts.delaGothicOne }}
      >
        Антропометрия
      </Typography>

      <Grid container spacing={3}>
        {measurements && measurements.length > 0 ? (
          measurements.map((measurement, index) => {
            const isLastMeasurement = index === measurements.length - 1;
            const showComparison =
              isLastMeasurement && selectedMeasurement && selectedMeasurement.id !== measurement.id;
            const isSelected = selectedMeasurement && selectedMeasurement.id === measurement.id;

            return (
              <Grid item xs={12} sm={6} md={4} key={measurement.id}>
                <Card
                  onClick={() => handleMeasurementClick(measurement)}
                  sx={{
                    height: '100%',
                    boxShadow: isSelected
                      ? '0 6px 12px rgba(42, 41, 223, 0.3)'
                      : isLastMeasurement
                      ? '0 6px 12px rgba(76, 175, 80, 0.3)'
                      : '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    cursor: 'pointer',
                    border: isSelected
                      ? '2px solid rgb(42, 41, 223)'
                      : isLastMeasurement
                      ? '2px solid rgb(76, 175, 80)'
                      : 'none',
                    backgroundColor: isSelected
                      ? 'rgba(42, 41, 223, 0.1)'
                      : isLastMeasurement
                      ? 'rgba(76, 175, 80, 0.1)'
                      : 'rgba(240, 240, 240, 0.7)',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)',
                      backgroundColor: isSelected
                        ? 'rgba(42, 41, 223, 0.15)'
                        : isLastMeasurement
                        ? 'rgba(76, 175, 80, 0.15)'
                        : 'rgba(240, 240, 240, 0.9)',
                    },
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(measurement);
                    }}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        color: 'red',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: isSelected
                          ? 'rgb(42, 41, 223) !important'
                          : isLastMeasurement
                          ? 'rgb(76, 175, 80) !important'
                          : 'black !important',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatDate(measurement.date)}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: 'black !important', textAlign: 'left' }}
                      >
                        <strong>Вес:</strong> {measurement.weight} кг
                        {showComparison && (
                          <span
                            style={{
                              marginLeft: '8px',
                              color: getDifferenceColor(
                                calculateDifference(measurement.weight, selectedMeasurement.weight),
                              ),
                            }}
                          >
                            {calculateDifference(measurement.weight, selectedMeasurement.weight) &&
                              `(${calculateDifference(
                                measurement.weight,
                                selectedMeasurement.weight,
                              )})`}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: 'black !important', textAlign: 'left' }}
                      >
                        <strong>Рост:</strong> {measurement.height} см
                        {showComparison && (
                          <span
                            style={{
                              marginLeft: '8px',
                              color: getDifferenceColor(
                                calculateDifference(measurement.height, selectedMeasurement.height),
                              ),
                            }}
                          >
                            {calculateDifference(measurement.height, selectedMeasurement.height) &&
                              `(${calculateDifference(
                                measurement.height,
                                selectedMeasurement.height,
                              )})`}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: 'black !important', textAlign: 'left' }}
                      >
                        <strong>Грудь:</strong>{' '}
                        {measurement.chest !== undefined &&
                        measurement.chest !== null &&
                        measurement.chest !== ''
                          ? `${measurement.chest} см${
                              showComparison && selectedMeasurement.chest
                                ? calculateDifference(measurement.chest, selectedMeasurement.chest)
                                  ? ` (${calculateDifference(
                                      measurement.chest,
                                      selectedMeasurement.chest,
                                    )})`
                                  : ''
                                : ''
                            }`
                          : 'Не указано'}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: 'black !important', textAlign: 'left' }}
                      >
                        <strong>Талия:</strong>{' '}
                        {measurement.waist !== undefined &&
                        measurement.waist !== null &&
                        measurement.waist !== ''
                          ? `${measurement.waist} см${
                              showComparison && selectedMeasurement.waist
                                ? calculateDifference(measurement.waist, selectedMeasurement.waist)
                                  ? ` (${calculateDifference(
                                      measurement.waist,
                                      selectedMeasurement.waist,
                                    )})`
                                  : ''
                                : ''
                            }`
                          : 'Не указано'}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: 'black !important', textAlign: 'left' }}
                      >
                        <strong>Бёдра:</strong>{' '}
                        {measurement.hips !== undefined &&
                        measurement.hips !== null &&
                        measurement.hips !== ''
                          ? `${measurement.hips} см${
                              showComparison && selectedMeasurement.hips
                                ? calculateDifference(measurement.hips, selectedMeasurement.hips)
                                  ? ` (${calculateDifference(
                                      measurement.hips,
                                      selectedMeasurement.hips,
                                    )})`
                                  : ''
                                : ''
                            }`
                          : 'Не указано'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary', ...fonts.montserrat }}
            >
              У вас пока нет карточек замеров
            </Typography>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMeasurement}
          sx={{
            backgroundColor: 'rgb(0, 0, 0)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
            '&:hover': {
              backgroundColor: 'rgb(160, 158, 158)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          Добавить замер
        </Button>
      </Box>

      {showForm && (
        <Card
          sx={{
            mt: 3,
            p: 3,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => setShowForm(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" sx={{ mb: 3, color: 'rgb(42, 41, 223)' }}>
            Новый замер
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="date"
                  label="Дата"
                  value={formData.date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="weight"
                  label="Вес (кг)"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="height"
                  label="Рост (см)"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="chest"
                  label="Обхват груди (см)"
                  value={formData.chest}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="waist"
                  label="Обхват талии (см)"
                  value={formData.waist}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="hips"
                  label="Обхват бёдер (см)"
                  value={formData.hips}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: 'rgb(0, 0, 0)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                    '&:hover': {
                      backgroundColor: 'rgb(160, 158, 158)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                    },
                  }}
                >
                  Сохранить
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundColor: 'white',
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
            Вы уверены, что хотите удалить этот замер? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
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
            onClick={handleDeleteConfirm}
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
