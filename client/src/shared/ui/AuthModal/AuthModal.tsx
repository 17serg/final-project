import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = (): void => {
    navigate(CLIENT_ROUTES.LOGIN);
    onClose();
  };

  const styles = {
    dialog: {
      '& .MuiDialog-paper': {
        width: '400px',
        maxWidth: '90%',
        margin: '20px',
        borderRadius: '8px',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.73), rgba(128, 128, 128, 0.73) 70%)',
        transition: "all 0.3s ease",
        backdropFilter: "blur(9px)",
        padding: '20px',
        position: 'relative',
        overflow: 'visible',
      },
      '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    content: {
      textAlign: 'center',
      padding: '0 20px',
    },
    actions: {
      justifyContent: 'center',
      padding: '20px 0 0',
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      sx={styles.dialog}
      disableScrollLock
      keepMounted
    >
      <DialogTitle sx={styles.title}>
        <Typography variant="h6">Пожалуйста, авторизуйтесь</Typography>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        <Typography variant="body1">
          Для доступа к этой странице необходимо войти в систему
        </Typography>
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleConfirm}
          sx={{ 
            backgroundColor: 'rgba(160, 158, 158, 0.57)',
            '&:hover': {
              backgroundColor: 'rgb(160, 158, 158)',
            }
          }}
        >
          Войти
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 