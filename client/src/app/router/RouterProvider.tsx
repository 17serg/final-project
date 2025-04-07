import React from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout/Layout';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { SignUpPage, LoginPage, SingUpPageTrener, ChatPage, AllTrenerPage, AllClientsPage } from '@/pages';
import { MainPage } from '@/pages/MainPage/MainPage';
import { ProtectedRoute } from '../providers/ProtectedRoute';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import { CalendarPage } from '@/pages/CalendarPage';
import { TrainingPage } from '@/pages/TrainingPage/TrainingPage';
import CatalogExercisePage from '@/pages/CatalogExercisePage/CatalogExercisePage';

export function RouterProvider(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={CLIENT_ROUTES.MAIN} element={<MainPage />} />

        <Route path={CLIENT_ROUTES.SIGN_UP} element={
          <ProtectedRoute requireAuth={false}>
            <SignUpPage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.SIGN_UP_TRENER} element={
          <ProtectedRoute requireAuth={false}>
            <SingUpPageTrener />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.LOGIN} element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.CHAT} element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.ALLTRENER} element={
          <ProtectedRoute>
            <AllTrenerPage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.ALLCLIENTS} element={
          <ProtectedRoute>
            <AllClientsPage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.CATALOGEXERCISE} element={
          <ProtectedRoute>
            <CatalogExercisePage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.PROFILE} element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.EDITING} element={
          <ProtectedRoute>
            <h1>Edit Profile Page</h1>
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.ABOUT} element={<h1>About Page</h1>} />
        <Route path={CLIENT_ROUTES.CALENDAR} element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.TRAINING} element={
          <ProtectedRoute>
            <TrainingPage />
          </ProtectedRoute>
        } />
        <Route path={CLIENT_ROUTES.NOT_FOUND} element={<h1>No content</h1>} />
      </Route>
    </Routes>
  );
}
