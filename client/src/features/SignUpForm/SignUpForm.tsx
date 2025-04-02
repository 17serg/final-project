import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
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
  const [isActive, setIsActive] = useState(false);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: IUserSignUpData = {
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      birthDate: formData.get('birthDate') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      trener: isActive,
    };
    const response = await UserApi.signup(data);
    if (response.status === 200) setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    navigate(CLIENT_ROUTES.PROFILE);
  };

  const handleProfileNavigate = (): void => {
    navigate(CLIENT_ROUTES.PROFILE);
  };

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-around"
      py={5}
      onSubmit={submitHandler}
    >
      <Button variant="contained" onClick={() => navigate('/signuptrener')}>
        Перейти на новую страницу тренера
      </Button>
      <Button
        variant={isActive ? 'contained' : 'outlined'}
        onClick={() => setIsActive(!isActive)}
        sx={{ mb: 2 }}
      >
        {isActive ? 'Тренер' : 'Обычный пользователь'}
      </Button>
      <TextField variant="outlined" name="name" label="Name" />
      <br />
      <TextField variant="outlined" name="surname" label="Surname" />
      <br />
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Basic date picker" />
      </DemoContainer>
    </LocalizationProvider> */}
      <TextField variant="outlined" name="birthDate" label="birthDate" />
      <br />
      <TextField variant="outlined" name="email" label="Email" type="email" />
      <br />
      <TextField variant="outlined" name="password" label="Password" type="password" />
      <br />
      <Button variant="outlined" type="submit" onClick={handleProfileNavigate}>
        Sign Up
      </Button>
      <br />
    </Box>
  );
}
