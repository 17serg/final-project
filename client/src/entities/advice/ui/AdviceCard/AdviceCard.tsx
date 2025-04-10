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
    minHeight: '230px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  adviceText: {
    fontSize: '1.2rem',
    lineHeight: 1.6,
    color: 'rgba(0, 0, 0, 0.9) !important',
    marginBottom: '20px',
  },
  button: {
    background: 'black',
    color: 'white',
    padding: '10px 20px',
    transition: 'all 0.2s ease',
    transform: 'translateY(0)',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.8)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  favoriteButton: {
    background: 'rgba(73, 124, 59, 0.9)',
    color: 'white',
    padding: '10px 20px',
    transition: 'all 0.2s ease',
    transform: 'translateY(0)',
    '&:hover': {
      background: 'rgb(86, 146, 71)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
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
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
  deleteButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: 'rgba(0, 0, 0, 0.5)',
    transition: 'all 0.2s ease',
    transform: 'scale(1)',
    '&:hover': {
      color: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      transform: 'scale(1.1)',
    },
  },
  savedAdviceContent: {
    paddingRight: '40px',
    color: 'rgba(0, 0, 0, 0.9)',
  },
  sectionTitle: {
    fontSize: '2.0rem !important',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9) !important',
    marginBottom: '20px',
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
      let newAdvice: Advice | null = null;
      let attempts = 0;
      const maxAttempts = 5; // Максимальное количество попыток

      // Пытаемся получить новый совет, которого нет в избранном
      while (attempts < maxAttempts) {
        const response = await AdviceApi.getRandomAdvice();
        if (response.data.success) {
          const potentialAdvice = response.data.data;
          // Проверяем, нет ли этого совета в избранном
          const isAlreadySaved = savedAdvices.some(saved => saved.id === potentialAdvice.id);
          
          if (!isAlreadySaved) {
            newAdvice = potentialAdvice;
            break;
          }
        }
        attempts++;
      }

      if (newAdvice) {
        setAdvice(newAdvice);
      } else {
        // Если не удалось найти новый совет, показываем сообщение
        setAdvice(null);
        alert('Все доступные советы уже добавлены в избранное');
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
        setSavedAdvices(prev => prev.filter(item => item.id !== advice.id));
      } else {
        await UserAdviceApi.saveAdvice(advice.id);
        setIsSaved(true);
        setSavedAdvices(prev => [...prev, advice]);
      }
    } catch (error) {
      console.error('Error toggling advice save:', error);
    }
  };

  const handleDeleteSavedAdvice = async (adviceId: number): Promise<void> => {
    try {
      setDeletingAdviceId(adviceId);
      await UserAdviceApi.removeAdvice(adviceId);
      setSavedAdvices(prev => prev.filter(item => item.id !== adviceId));

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
        <Typography variant="h5" sx={{ color: 'rgba(0, 0, 0, 0.9) !important', fontWeight: 'bold', marginBottom: '20px', fontSize: '2.0rem !important' }}>
          Фитнес-советы
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
        <Typography variant="h6" sx={styles.sectionTitle}>
          Избранное
        </Typography>
        {loadingSaved ? (
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.9) !important', fontSize: '1rem' }}>Загрузка...</Typography>
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
                <Typography sx={{ color: 'rgba(0, 0, 0, 0.9) !important', fontSize: '1rem' }}>{savedAdvice.text}</Typography>
              </Box>
            </Card>
          ))
        ) : (
          <Typography sx={{ color: 'rgb(255, 255, 255) !important', fontSize: '1rem' }}>У вас пока нет сохраненных советов</Typography>
        )}
      </Box>
    </Box>
  );
};
