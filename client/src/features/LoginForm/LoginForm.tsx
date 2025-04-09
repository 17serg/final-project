import React, { useState } from 'react';
import { Box, Button, TextField, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useUser } from '@/entities/user/hooks/useUser';
import { UserApi } from '@/entities/user/api/UserApi';
import { setAccessToken } from '@/shared/lib/axiosInstance';
import { useAppDispatch } from '@/shared/lib/reduxHooks';
import { fonts } from '@/shared/styles/fonts';

export default function LoginForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const dispatch = useAppDispatch();
  
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку авторизации при вводе
    setAuthError('');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formValues.email.trim()) {
      errors.email = 'Не все поля заполнены';
    }
    
    if (!formValues.password.trim()) {
      errors.password = 'Не все поля заполнены';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loginHandler = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await UserApi.login(formValues);
      if (response.status === 200) {
        setUser(response.data.user);
        setAccessToken(response.data.accessToken);
        navigate('/profile');
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      setAuthError('Неверный email или пароль');
      // Устанавливаем ошибку для полей, чтобы показать красную обводку
      setFormErrors({
        email: ' ',
        password: ' '
      });
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
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
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
            color: 'rgba(0, 0, 0, 0.9)',
            mb: 3
          }}
        >
          Авторизация
        </Typography>
        
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          alignItems="center"
          onSubmit={loginHandler}
          sx={{ gap: 2.5 }}
        >
          <TextField 
            variant="outlined" 
            name="email" 
            label="Email" 
            type="email" 
            fullWidth
            value={formValues.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email === ' ' ? '' : formErrors.email}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
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
            }}
          />
          
          <TextField 
            variant="outlined" 
            name="password" 
            label="Пароль" 
            type="password" 
            fullWidth
            value={formValues.password}
            onChange={handleInputChange}
            error={!!formErrors.password}
            helperText={formErrors.password === ' ' ? '' : formErrors.password}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
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
            }}
          />
          
          {authError && (
            <Typography 
              color="error" 
              sx={{ 
                mt: 1, 
                mb: 1, 
                textAlign: 'center',
                fontWeight: 'medium'
              }}
            >
              {authError}
            </Typography>
          )}
          
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
            Войти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
