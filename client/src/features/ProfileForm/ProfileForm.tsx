import React, { useState, useRef, useEffect, useContext } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, SelectChangeEvent, Typography } from '@mui/material';
import { IUserProfile } from '@/entities/user/model';
import { UserApi } from '@/entities/user/api/UserApi';
import { useUser } from '@/entities/user/hooks/useUser';
import { getUserColor } from '@/shared/utils/userColor';
import { UserContext, UserContextType } from '@/entities/user/provider/UserProvider';
import { IUser } from '@/entities/user/model';

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export default function ProfileForm({ open, onClose, userId }: ProfileFormProps): React.JSX.Element {
  const { user, setUser } = useContext(UserContext) as UserContextType;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<IUserProfile>({
    avatar: '',
    gender: 'other',
    trainingExperience: 0,
    userId,
    personalRecords: 0,
    trainingCount: 0,
    about: '',
    name: '',
    email: '',
    id: 0,
    UserProfile: {
      avatar: '',
      gender: 'other',
      trainingExperience: 0,
      personalRecords: 0,
      trainingCount: 0,
      userId: 0,
      about: ''
    }
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка актуальных данных профиля при открытии модального окна
  useEffect(() => {
    const loadProfileData = async (): Promise<void> => {
      if (open && user) {
        try {
          const response = await UserApi.getProfile();
          if (response.data) {
            setFormData({
              ...formData,
              gender: response.data.gender || 'other',
              trainingExperience: response.data.trainingExperience || 0,
              about: response.data.about || '',
              UserProfile: {
                ...formData.UserProfile,
                gender: response.data.gender || 'other',
                trainingExperience: response.data.trainingExperience || 0,
                about: response.data.about || '',
                avatar: response.data.avatar || ''
              }
            });

            // Устанавливаем URL для аватара, если он есть
            if (response.data.avatar) {
              const baseUrl = import.meta.env.VITE_API.replace('/api', '');
              setPreviewUrl(`${baseUrl}${response.data.avatar}`);
            } else {
              setPreviewUrl(null);
            }
          }
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      }
    };

    loadProfileData();
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('trainingExperience', formData.trainingExperience.toString());
      formDataToSend.append('about', formData.about || '');
      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append('avatar', fileInputRef.current.files[0]);
      }

      const response = await UserApi.updateProfile(formDataToSend);
      console.log('Ответ сервера:', response);
      
      if (response.data && user) {
        // Обновляем данные пользователя в контексте
        const updatedUser: IUser = {
          id: user.id,
          name: response.data.name,
          email: response.data.email,
          trener: user.trener,
          UserProfile: {
            ...user.UserProfile,
            ...response.data,
            trainingExperience: Number(response.data.trainingExperience),
            userId: user.id
          }
        };
        setUser(updatedUser);
        
        // Отправляем событие обновления профиля
        window.dispatchEvent(new Event('profileUpdated'));
        
        onClose();
      }
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setError('Не удалось обновить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'trainingExperience' ? (value === '' ? 0 : Number(value)) : value,
      UserProfile: {
        ...prev.UserProfile,
        [name]: name === 'trainingExperience' ? (value === '' ? 0 : Number(value)) : value
      }
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
      reader.onloadend = (): void => {
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
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.29), rgba(143, 141, 141, 0.11) 70%)',
          transition: "all 0.3s ease",
          backdropFilter: "blur(20px)",
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          backgroundColor: 'rgba(80, 80, 80, 0.75)', 
          borderRadius: '16px 16px 0px 0px',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Редактирование профиля
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} sx={{ mt: 2 }}>
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
          
          <FormControl fullWidth>
            <InputLabel id="gender-label" sx={{ color: 'rgba(192, 192, 192, 0.9)' }}>Пол</InputLabel>
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
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(255, 255, 255)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(255, 255, 255)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(177, 174, 174)',
                  borderWidth: '1px',
                },
                '& .MuiSelect-select': {
                  color: 'rgb(255, 255, 255)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgb(255, 255, 255)',
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
            label={user?.trener ? "Стаж работы (лет)" : "Опыт тренировок (лет)"}
            name="trainingExperience"
            type="number"
            value={formData.trainingExperience}
            onChange={handleInputChange}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(255, 255, 255)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(255, 255, 255)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(255, 255, 255)',
                  borderWidth: '1px',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(255, 255, 255, 0.9)',
                }
              }
            }}
          />

          <TextField
            fullWidth
            label={user?.trener ? "О себе" : "Цель тренировки"}
            name="about"
            multiline
            rows={4}
            value={formData.about}
            onChange={handleInputChange}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                  borderWidth: '1px',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(255, 255, 255, 0.9)',
                }
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
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
          onClick={handleSubmit} 
          variant="contained"
          sx={{ 
            backgroundColor: 'rgba(128, 128, 128, 0.9)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(128, 128, 128, 0.7)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
} 