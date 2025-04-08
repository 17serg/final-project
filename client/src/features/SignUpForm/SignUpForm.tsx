import React, { useState } from 'react';
import { Box, Button, TextField, Paper, Typography, Container, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router';
import { useUser } from '@/entities/user/hooks/useUser';
import { UserApi } from '@/entities/user/api/UserApi';
import { IUserSignUpData } from '@/entities/user/model';
import { setAccessToken } from '@/shared/lib/axiosInstance';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function SignUpForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
      trener: false,
    };
    
    try {
    const response = await UserApi.signup(data);
      if (response.status === 200) {
        setUser(response.data.user);
    setAccessToken(response.data.accessToken);
        navigate(CLIENT_ROUTES.PROFILE);
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  };

  const handleProfileNavigate = (): void => {
    navigate(CLIENT_ROUTES.PROFILE);
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          mt: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
          transition: "all 0.3s ease",
          backdropFilter: "blur(9px)",
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold', 
            color: 'white',
            mb: 3
          }}
        >
          Регистрация
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
                '&:hover fieldset': {
                  borderColor: 'rgba(160, 158, 158, 0.57)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
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
                '&:hover fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
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
                '&:hover fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
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
                '&:hover fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
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
                '&:hover fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
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
                '&:hover fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(42, 41, 223)',
                },
              },
            }}
          />
          
          <Button 
            variant="contained" 
            type="submit"
            sx={{ 
              mt: 3, 
              backgroundColor: 'rgba(160, 158, 158, 0.57)',
              '&:hover': {
                backgroundColor: 'rgb(160, 158, 158)',
              },
              borderRadius: 2,
              py: 1.5,
              px: 4,
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              width: '100%',
            }}
          >
            Зарегистрироваться
      </Button>
          
      <Button
            variant="contained" 
            onClick={() => navigate('/signuptrener')}
            sx={{ 
              mt: 1, 
              backgroundColor: 'rgba(128, 124, 124, 0.27)',
              '&:hover': {
                backgroundColor: 'rgb(160, 158, 158)',
              },
              borderRadius: 2,
              py: 1,
              px: 3,
              fontWeight: 'medium',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            }}
          >
            Если вы тренер
      </Button>
    </Box>
      </Paper>
    </Container>
  );
}
