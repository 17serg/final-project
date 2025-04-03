import React, { useState, useRef } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, SelectChangeEvent } from '@mui/material';
import { IUserProfile } from '@/entities/user/model';
import { UserApi } from '@/entities/user/api/UserApi';
import { useUser } from '@/entities/user/hooks/useUser';

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export default function ProfileForm({ open, onClose, userId }: ProfileFormProps): React.JSX.Element {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<IUserProfile>({
    avatar: '',
    gender: 'other',
    trainingExperience: 0,
    userId,
    personalRecords: 0,
    trainingCount: 0
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (): Promise<void> => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('trainingExperience', formData.trainingExperience.toString());
      
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        // Создаем URL для файла
        const fileUrl = URL.createObjectURL(file);
        formDataToSend.append('avatar', fileUrl);
      }
      
      const response = await UserApi.updateProfile(formDataToSend as unknown as IUserProfile);
      
      // Обновляем данные пользователя после успешного сохранения
      if (user && response.data) {
        setUser({
          ...user,
          ...response.data
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'trainingExperience' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent): void => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      // Создаем URL для предпросмотра
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleAvatarClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Настройка профиля</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          <Avatar
            src={previewUrl || user?.avatar || ''}
            alt={user?.name || 'User'}
            sx={{ width: 100, height: 100, mb: 2, cursor: 'pointer', border: '2px solid rgb(42, 41, 223)' }}
            onClick={handleAvatarClick}
          >
            {user?.name?.[0] || 'U'}
          </Avatar>
          
          <Button 
            variant="outlined" 
            onClick={handleAvatarClick}
            sx={{ mb: 2 }}
          >
            Выбрать аватарку
          </Button>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Пол</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
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