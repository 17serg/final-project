import React, { useState } from 'react';
import { Box, Button, TextField, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useUser } from '@/entities/user/hooks/useUser';
import { UserApi } from '@/entities/user/api/UserApi';
import { setAccessToken } from '@/shared/lib/axiosInstance';
import { fonts } from '@/shared/styles/fonts';

export default function SingUpFormTrener(): React.JSX.Element {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const isActive = true;
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState({
    name: '',
    surname: '',
    email: '',
  });

  const formatBirthDate = (value: string): string => {
    // Удаляем все нецифровые символы
    const digitsOnly = value.replace(/\D/g, '');
    
    // Ограничиваем длину до 8 цифр (день.месяц.год)
    const truncated = digitsOnly.slice(0, 8);
    
    // Форматируем дату
    let formatted = '';
    if (truncated.length > 0) {
      formatted += truncated.slice(0, 2); // День
    }
    if (truncated.length > 2) {
      formatted += '.' + truncated.slice(2, 4); // Месяц
    }
    if (truncated.length > 4) {
      formatted += '.' + truncated.slice(4); // Год
    }
    
    return formatted;
  };

  const handleBirthDateChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const formattedDate = formatBirthDate(event.target.value);
    setBirthDate(formattedDate);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(event.target.value);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Проверка заполнения всех полей
    if (!formValues.name.trim()) {
      errors.name = 'Не все поля заполнены';
    }
    
    if (!formValues.surname.trim()) {
      errors.surname = 'Не все поля заполнены';
    }
    
    if (!birthDate.trim()) {
      errors.birthDate = 'Не все поля заполнены';
    }
    
    if (!formValues.email.trim()) {
      errors.email = 'Не все поля заполнены';
    }
    
    if (!password.trim()) {
      errors.password = 'Не все поля заполнены';
    }
    
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Не все поля заполнены';
    }
    
    // Проверка совпадения паролей
    if (password !== confirmPassword && password && confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    // Проверяем валидность формы
    if (!validateForm()) {
      return;
    }
    
    const data = {
      name: formValues.name,
      surname: formValues.surname,
      birthDate: birthDate,
      email: formValues.email,
      password: password,
      trener: isActive,
    };
    
    try {
    const response = await UserApi.signup(data);
      if (response.status === 200) {
        setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    navigate('/');
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          mt: 4, 
          mb: 4, 
          borderRadius: '24px',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            ...fonts.delaGothicOne,
            fontWeight: 'bold', 
            color: 'white',
            mb: 3
          }}
        >
          Регистрация тренера
        </Typography>
        
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      alignItems="center"
      onSubmit={submitHandler}
          sx={{ gap: 2.5 }}
        >
          <TextField 
            variant="outlined" 
            name="name" 
            label="Имя" 
            fullWidth
            value={formValues.name}
            onChange={handleInputChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                '&.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
          />
          
          <TextField 
            variant="outlined" 
            name="surname" 
            label="Фамилия" 
            fullWidth
            value={formValues.surname}
            onChange={handleInputChange}
            error={!!formErrors.surname}
            helperText={formErrors.surname}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                '&.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
          />
          
          <TextField 
            variant="outlined" 
            name="birthDate" 
            label="Дата рождения" 
            fullWidth
            value={birthDate}
            onChange={handleBirthDateChange}
            placeholder="ДД.ММ.ГГГГ"
            inputProps={{ maxLength: 10 }}
            error={!!formErrors.birthDate}
            helperText={formErrors.birthDate}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                '&.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
          />
          
          <TextField 
            variant="outlined" 
            name="email" 
            label="Email" 
            type="email" 
            fullWidth
            value={formValues.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                '&.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
          />
          
          <TextField 
            variant="outlined" 
            name="password" 
            label="Пароль" 
            type="password" 
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                '&.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
          />
          
          <TextField 
            variant="outlined" 
            name="confirmPassword" 
            label="Подтвердите пароль" 
            type="password" 
            fullWidth
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                '&.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
          />
          
          <Button 
            variant="contained" 
            type="submit"
            sx={{ 
              mt: 3, 
              backgroundColor: 'rgb(0, 0, 0)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgb(160, 158, 158)',
              },
              borderRadius: '8px',
              py: 1.5,
              px: 4,
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              width: '100%',
            }}
          >
            Зарегистрироваться как тренер
          </Button>
          
          <Button 
            variant="contained" 
            onClick={() => navigate('/signup')}
            sx={{ 
              mt: 1, 
              backgroundColor: 'rgb(56, 56, 56)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgb(160, 158, 158)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
              },
              borderRadius: '8px',
              py: 1,
              px: 3,
              fontWeight: 'medium',
            }}
          >
            Если вы обычный пользователь
      </Button>
    </Box>
      </Paper>
    </Container>
  );
}
