import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, IconButton } from '@mui/material';
import { AdviceApi, Advice } from '../../api/AdviceApi';
import { UserAdviceApi, UserAdvice } from '../../api/UserAdviceApi';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';

const styles = {
  card: {
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  adviceText: {
    fontSize: '1.2rem',
    lineHeight: 1.6,
    color: 'rgba(0, 0, 0, 0.8)',
    marginBottom: '20px',
  },
  button: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    padding: '10px 20px',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
    },
  },
  favoriteButton: {
    background: 'linear-gradient(45deg, #FF4081 30%, #FF80AB 90%)',
    color: 'white',
    padding: '10px 20px',
    '&:hover': {
      background: 'linear-gradient(45deg, #F50057 30%, #FF4081 90%)',
    },
  },
  buttonsContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  savedAdvicesContainer: {
    marginTop: '20px',
  },
  savedAdviceCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '10px',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: '#FF4081',
    '&:hover': {
      color: '#F50057',
    },
  },
  savedAdviceContent: {
    paddingRight: '40px', // Место для кнопки удаления
  },
};

export const AdviceCard: React.FC = () => {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedAdvices, setSavedAdvices] = useState<Advice[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [deletingAdviceId, setDeletingAdviceId] = useState<number | null>(null);

  const loadSavedAdvices = async (): Promise<void> => {
    try {
      setLoadingSaved(true);
      const response = await UserAdviceApi.getUserAdvices();
      if (response.data.success) {
        setSavedAdvices(response.data.data.map((ua: UserAdvice) => ua.advice));
      }
    } catch (error) {
      console.error('Error loading saved advices:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    loadSavedAdvices();
  }, []);

  useEffect(() => {
    const checkIfSaved = async (): Promise<void> => {
      if (advice) {
        try {
          const response = await UserAdviceApi.isAdviceSaved(advice.id);
          if (response.data.success) {
            setIsSaved(response.data.data);
          }
        } catch (error) {
          console.error('Error checking if advice is saved:', error);
        }
      }
    };
    checkIfSaved();
  }, [advice]);

  const handleGetAdvice = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await AdviceApi.getRandomAdvice();
      if (response.data.success) {
        setAdvice(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (): Promise<void> => {
    if (!advice) return;

    try {
      if (isSaved) {
        await UserAdviceApi.removeAdvice(advice.id);
        setIsSaved(false);
      } else {
        await UserAdviceApi.saveAdvice(advice.id);
        setIsSaved(true);
      }
      await loadSavedAdvices();
    } catch (error) {
      console.error('Error toggling advice save:', error);
    }
  };

  const handleDeleteSavedAdvice = async (adviceId: number): Promise<void> => {
    try {
      setDeletingAdviceId(adviceId);
      await UserAdviceApi.removeAdvice(adviceId);
      await loadSavedAdvices();

      // Если удаляем текущий совет, сбрасываем состояние isSaved
      if (advice && advice.id === adviceId) {
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error deleting saved advice:', error);
    } finally {
      setDeletingAdviceId(null);
    }
  };

  return (
    <Box>
      <Card sx={styles.card}>
        <Typography variant="h5" gutterBottom>
          Совет дня
        </Typography>
        {advice ? (
          <Typography sx={styles.adviceText}>{advice.text}</Typography>
        ) : (
          <Typography sx={styles.adviceText}>Нажмите кнопку, чтобы получить совет</Typography>
        )}
        <Box sx={styles.buttonsContainer}>
          <Button
            variant="contained"
            onClick={handleGetAdvice}
            disabled={loading}
            sx={styles.button}
          >
            {loading ? 'Загрузка...' : 'Получить совет'}
          </Button>
          {advice && (
            <Button
              variant="contained"
              onClick={handleToggleSave}
              disabled={loading}
              sx={styles.favoriteButton}
              startIcon={isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            >
              {isSaved ? 'В избранном' : 'В избранное'}
            </Button>
          )}
        </Box>
      </Card>

      <Box sx={styles.savedAdvicesContainer}>
        <Typography variant="h6" gutterBottom>
          Сохраненные советы
        </Typography>
        {loadingSaved ? (
          <Typography>Загрузка...</Typography>
        ) : savedAdvices.length > 0 ? (
          savedAdvices.map((savedAdvice) => (
            <Card key={savedAdvice.id} sx={styles.savedAdviceCard}>
              <IconButton
                sx={styles.deleteButton}
                onClick={() => handleDeleteSavedAdvice(savedAdvice.id)}
                disabled={deletingAdviceId === savedAdvice.id}
              >
                <DeleteIcon />
              </IconButton>
              <Box sx={styles.savedAdviceContent}>
                <Typography>{savedAdvice.text}</Typography>
              </Box>
            </Card>
          ))
        ) : (
          <Typography>У вас пока нет сохраненных советов</Typography>
        )}
      </Box>
    </Box>
  );
};
