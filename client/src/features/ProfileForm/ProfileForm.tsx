import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IUserProfile } from '@/entities/user/model';
import { UserApi } from '@/entities/user/api/UserApi';

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export default function ProfileForm({ open, onClose, userId }: ProfileFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<IUserProfile>({
    avatar: '',
    gender: 'other',
    trainingExperience: 0,
    userId
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      await UserApi.updateProfile(formData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>): void => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Настройка профиля</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="URL аватара"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Пол</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Пол"
            >
              <MenuItem value="male">Мужской</MenuItem>
              <MenuItem value="female">Женский</MenuItem>
              <MenuItem value="other">Другой</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Стаж тренировок (лет)"
            name="trainingExperience"
            type="number"
            value={formData.trainingExperience}
            onChange={handleChange}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
} 