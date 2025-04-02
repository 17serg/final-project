import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import BookList from '@/widgets/ProductList/BookList';
import ProfileForm from '@/features/ProfileForm/ProfileForm';
import { useUser } from '@/entities/user/hooks/useUser';

export function MainPage(): React.JSX.Element {
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <Box display="flex" justifyContent="center" my={4}>
        <Button variant="contained" color="primary" onClick={() => setIsProfileFormOpen(true)}>
          Настроить профиль
        </Button>
      </Box>
      <BookList />
      {user && (
        <ProfileForm
          open={isProfileFormOpen}
          onClose={() => setIsProfileFormOpen(false)}
          userId={user.id}
        />
      )}
    </>
  );
}
