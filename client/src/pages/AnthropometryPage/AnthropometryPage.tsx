import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, TextField, Grid, IconButton, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { AnthropometryApi } from '@/entities/anthropometry/api/AnthropometryApi';
import { IAnthropometry } from '@/entities/anthropometry/model';
import { useUser } from '@/entities/user/hooks/useUser';

export default function AnthropometryPage(): React.JSX.Element {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState<IAnthropometry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<IAnthropometry>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    height: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    userId: user?.id || 0
  });
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    loadMeasurements();
  }, [user]);

  const loadMeasurements = async (): Promise<void> => {
    try {
      const data = await AnthropometryApi.getMeasurements();
      setMeasurements(data || []);
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
      [name]: name === 'date' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      // Проверка на валидность данных
      if (!formData.date || formData.weight <= 0 || formData.height <= 0) {
        setError('Пожалуйста, заполните все обязательные поля корректными значениями.');
        setOpenSnackbar(true);
        return;
      }

      await AnthropometryApi.addMeasurement(formData);
      await loadMeasurements();
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: 0,
        height: 0,
        chest: 0,
        waist: 0,
        hips: 0,
        userId: user?.id || 0
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

  const formatDate = (dateValue: string | number): string => {
    try {
      // Если dateValue - это timestamp (число), преобразуем его в дату
      const date = typeof dateValue === 'number' 
        ? new Date(dateValue) 
        : new Date(dateValue);
      
      // Проверяем, что дата валидна
      if (isNaN(date.getTime())) {
        console.error('Невалидная дата:', dateValue);
        return 'Дата не указана';
      }
      
      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      console.error('Ошибка при форматировании даты:', error);
      return 'Дата не указана';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'rgb(42, 41, 223)' }}>
        Антропометрия
      </Typography>

      <Grid container spacing={3}>
        {measurements && measurements.length > 0 ? (
          measurements.map((measurement) => (
            <Grid item xs={12} sm={6} md={4} key={measurement.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: 'rgb(42, 41, 223)' }}>
                    {formatDate(measurement.date)}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: 'black !important' }}>Вес</Typography>
                      <Typography variant="body1" sx={{ color: 'black !important' }}>{measurement.weight} кг</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: 'black !important' }}>Рост</Typography>
                      <Typography variant="body1" sx={{ color: 'black !important' }}>{measurement.height} см</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: 'black !important' }}>Грудь</Typography>
                      <Typography variant="body1" sx={{ color: 'black !important' }}>{measurement.chest} см</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: 'black !important' }}>Талия</Typography>
                      <Typography variant="body1" sx={{ color: 'black !important' }}>{measurement.waist} см</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: 'black !important' }}>Бёдра</Typography>
                      <Typography variant="body1" sx={{ color: 'black !important' }}>{measurement.hips} см</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              У вас пока нет замеров. Добавьте первый замер, нажав на кнопку ниже.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          sx={{
            backgroundColor: 'rgb(42, 41, 223)',
            boxShadow: '0 4px 8px rgba(42, 41, 223, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(42, 41, 223, 0.8)',
              boxShadow: '0 6px 12px rgba(42, 41, 223, 0.4)',
            }
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
            position: 'relative'
          }}
        >
          <IconButton
            onClick={() => setShowForm(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
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
                    }
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
                    }
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
                    }
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
                    }
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
                    }
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
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: 'rgb(42, 41, 223)',
                    boxShadow: '0 4px 8px rgba(42, 41, 223, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(42, 41, 223, 0.8)',
                      boxShadow: '0 6px 12px rgba(42, 41, 223, 0.4)',
                    }
                  }}
                >
                  Сохранить
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

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
