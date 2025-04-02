import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router';
import { useUser } from '@/entities/user/hooks/useUser';
import { UserApi } from '@/entities/user/api/UserApi';
import { IUserSignUpData } from '@/entities/user/model';
import { setAccessToken } from '@/shared/lib/axiosInstance';

export default function SingUpFormTrener(): React.JSX.Element {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const isActive = true;

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
    console.log(response);
    if (response.status === 200) setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    navigate('/');
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
      <TextField variant="outlined" name="name" label="Name" />
      <br />
      <TextField variant="outlined" name="surname" label="Surname" />
      <br />
      <TextField variant="outlined" name="birthDate" label="birthDate" />
      <br />
      <TextField variant="outlined" name="email" label="Email" type="email" />
      <br />
      <TextField variant="outlined" name="password" label="Password" type="password" />
      <br />
      <Button variant="outlined" type="submit">
        Sign Up
      </Button>
      <br />
    </Box>
  );
}
