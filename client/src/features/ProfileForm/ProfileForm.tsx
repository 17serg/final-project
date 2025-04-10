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

interface IUserProfile {
  avatar: string;
  gender: string;
  trainingExperience: number | string;
  userId: number;
  personalRecords: number;
  trainingCount: number;
  about: string;
  name: string;
  email: string;
  id: number;
  UserProfile: {
    avatar: string;
    gender: string;
    trainingExperience: number | string;
    personalRecords: number;
    trainingCount: number;
    userId: number;
    about: string;
  };
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
    if (name === 'trainingExperience') {
      // Разрешаем пустое значение или положительное число
      if (value === '') {
        setFormData((prev) => ({
          ...prev,
          [name]: '',
          UserProfile: {
            ...prev.UserProfile,
            [name]: ''
          }
        }));
      } else {
        const numValue = Number(value);
        if (numValue >= 0 && !isNaN(numValue)) {
          setFormData((prev) => ({
            ...prev,
            [name]: numValue,
            UserProfile: {
              ...prev.UserProfile,
              [name]: numValue
            }
          }));
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        UserProfile: {
          ...prev.UserProfile,
          [name]: value
        }
      }));
    }
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

  const getYearsText = (years: number): string => {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'лет';
    }
    if (lastDigit === 1) {
      return 'год';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'года';
    }
    return 'лет';
  };

  const styles = {
    dialog: {
      '& .MuiDialog-paper': {
        borderRadius: '24px !important',
        padding: '20px',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      },
    },
    dialogTitle: {
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 0.9)',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      padding: '0 20px',
    },
    dialogContent: {
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      '&.MuiDialogContent-root': {
        borderRadius: '24px',
      }
    },
    dialogActions: {
      padding: '20px',
      justifyContent: 'center',
      borderRadius: '24px',
      '&.MuiDialogActions-root': {
        borderRadius: '24px',
      }
    },
    formControl: {
      width: '100%',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.9)',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.6)',
        '&.Mui-focused': {
          color: 'rgba(0, 0, 0, 0.9)',
        },
      },
    },
    select: {
      '& .MuiSelect-select': {
        color: 'rgba(0, 0, 0, 0.9)',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.5)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.9)',
      },
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        color: 'rgba(0, 0, 0, 0.9)',
        '& fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.9)',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.6)',
        '&.Mui-focused': {
          color: 'rgba(0, 0, 0, 0.9)',
        },
      },
    },
    button: {
      backgroundColor: 'rgb(0, 0, 0)',
      color: 'white',
      padding: '10px 30px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'none',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgb(160, 158, 158)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
      },
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={styles.dialog}
    >
      <DialogTitle 
        sx={styles.dialogTitle}
      >
        Редактирование профиля
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} sx={styles.dialogContent}>
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
                width: 150,
                height: 150,
                border: "4px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "150px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                bgcolor: getUserAvatarColor(),
                mb: 2,
              }}
            >
              <Typography variant="h1" sx={{ fontSize: "40px", fontWeight: "bold" }}>
                {user?.name?.[0] || "U"}
              </Typography>
            </Avatar>
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
                borderRadius: '150px',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                height: '90%',
              }}
            >
              <Typography variant="body2" color="white" sx={{ fontSize: '0.8rem' }}>
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
          
          <FormControl fullWidth sx={styles.formControl}>
            <InputLabel id="gender-label" sx={{ color: 'rgba(192, 192, 192, 0.9)' }}>Пол</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formData.gender}
              label="Пол"
              onChange={handleSelectChange}
              sx={styles.select}
            >
              <MenuItem value="male">Мужской</MenuItem>
              <MenuItem value="female">Женский</MenuItem>
              <MenuItem value="other">Другой</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label={user?.trener ? `Стаж работы (${getYearsText(Number(formData.trainingExperience))})` : `Стаж тренировок (${getYearsText(Number(formData.trainingExperience))})`}
            name="trainingExperience"
            type="text"
            value={formData.trainingExperience === 0 ? '' : formData.trainingExperience}
            onChange={handleInputChange}
            sx={styles.textField}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
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
            sx={styles.textField}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button 
          onClick={onClose} 
          sx={{
            backgroundColor: 'rgb(56, 56, 56)',
            color: 'white',
            padding: '10px 30px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgb(160, 158, 158)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
      },
          }}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={styles.button}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
} 