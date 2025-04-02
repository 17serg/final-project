import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import type { IUserLoginData } from '@/entities/user/model';
import { useNavigate } from 'react-router';
import { useUser } from '@/entities/user/hooks/useUser';
import { UserApi } from '@/entities/user/api/UserApi';
import { setAccessToken } from '@/shared/lib/axiosInstance';
import { useAppDispatch } from '@/shared/lib/reduxHooks';
import { loadAllBooksThunk, loadFavouriteBooksThunk, loadUserBooksThunk } from '../bookSlice/thunk';

export default function LoginForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const dispatch = useAppDispatch();
  const loginHandler = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: IUserLoginData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    const response = await UserApi.login(data);
    if (response.status === 200) setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    dispatch(loadAllBooksThunk());
    dispatch(loadUserBooksThunk());
    dispatch(loadFavouriteBooksThunk());
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
      onSubmit={loginHandler}
    >
      <TextField variant="outlined" name="email" label="Email" type="email" />
      <br />
      <TextField variant="outlined" name="password" label="Password" type="password" />
      <br />
      <Button variant="outlined" type="submit">
        Login
      </Button>
    </Box>
  );
}
