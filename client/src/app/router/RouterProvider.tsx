import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout/Layout';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { SignUpPage, LoginPage, SingUpPageTrener, ChatPage } from '@/pages';
import { MainPage } from '@/pages/MainPage/MainPage';
import { AddBookPage } from '@/pages/AddBookPage/AddBookPage';
import { BooksPage } from '@/pages/BooksPage/BooksPage';
import { useAppDispatch } from '@/shared/lib/reduxHooks';
import {
  loadAllBooksThunk,
  loadFavouriteBooksThunk,
  loadUserBooksThunk,
} from '@/features/bookSlice/thunk';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import { CalendarPage } from '@/pages/CalendarPage';
import { TrainingPage } from '@/pages/TrainingPage/TrainingPage';

export default function RouterProvider(): React.JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadAllBooksThunk());
    dispatch(loadUserBooksThunk());
    dispatch(loadFavouriteBooksThunk());
  }, []);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={CLIENT_ROUTES.MAIN} element={<MainPage />} />
        <Route path={CLIENT_ROUTES.BOOKS} element={<BooksPage />} />
        <Route path={CLIENT_ROUTES.ADDBOOK} element={<AddBookPage />} />
        <Route path={CLIENT_ROUTES.SIGN_UP} element={<SignUpPage />} />
        <Route path={CLIENT_ROUTES.SIGN_UP_TRENER} element={<SingUpPageTrener />} />
        <Route path={CLIENT_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={CLIENT_ROUTES.CHAT} element={<ChatPage />} />
        <Route path={CLIENT_ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={CLIENT_ROUTES.EDITING} element={<h1>Edit Profile Page</h1>} />
        <Route path={CLIENT_ROUTES.ABOUT} element={<h1>About Page</h1>} />
        <Route path={CLIENT_ROUTES.CALENDAR} element={<CalendarPage />} />
        <Route path={CLIENT_ROUTES.TRAINING} element={<TrainingPage />} />
        <Route path={CLIENT_ROUTES.NOT_FOUND} element={<h1>No content</h1>} />
      </Route>
    </Routes>
  );
}
