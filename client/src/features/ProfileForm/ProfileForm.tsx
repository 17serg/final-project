import React, { useState, useRef } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, SelectChangeEvent, Typography } from '@mui/material';
import { IUserProfile } from '@/entities/user/model';
import { UserApi } from '@/entities/user/api/UserApi';
import { useUser } from '@/entities/user/hooks/useUser';
import { getUserColor } from '@/shared/utils/userColor';

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
        formDataToSend.append('avatar', file);
        console.log('File to upload:', file);
      }
      
      console.log('Form data to send:', {
        gender: formData.gender,
        trainingExperience: formData.trainingExperience,
        hasFile: !!fileInputRef.current?.files?.[0]
      });
      
      const response = await UserApi.updateProfile(formDataToSend);
      console.log('Server response:', response);
      
      if (user && response.data) {
        setUser({
          ...user,
          profile: response.data
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
      [name]: value
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (): void => {
    fileInputRef.current?.click();
  };

  const getUserAvatarColor = (): string => {
    return user ? getUserColor(user.name) : '#1976d2';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          backgroundColor: 'rgb(42, 41, 223)', 
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Редактирование профиля
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Box 
            sx={{ 
              position: 'relative', 
              cursor: 'pointer',
              '&:hover': {
                '& .avatar-overlay': {
                  opacity: 1,
                }
              }
            }}
            onClick={handleAvatarClick}
          >
            <Avatar
              src={previewUrl || ''}
              alt={user?.name || 'User'}
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: getUserAvatarColor(),
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  transform: 'scale(1.05)',
                }
              }}
            />
            <Box
              className="avatar-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Typography variant="body2" color="white">
                Изменить фото
              </Typography>
            </Box>
          </Box>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="gender-label">Пол</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formData.gender}
              label="Пол"
              onChange={handleSelectChange}
              sx={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <MenuItem value="male">Мужской</MenuItem>
              <MenuItem value="female">Женский</MenuItem>
              <MenuItem value="other">Другой</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Опыт тренировок (лет)"
            name="trainingExperience"
            type="number"
            value={formData.trainingExperience}
            onChange={handleChange}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'text.secondary',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
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
      </DialogActions>
    </Dialog>
  );
} 