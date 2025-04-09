import React, { useState } from 'react';
import { Box, Card, Typography, Button } from '@mui/material';
import { AdviceApi, Advice } from '../../api/AdviceApi';

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
    alignSelf: 'flex-end',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    padding: '10px 20px',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
    },
  },
};

export const AdviceCard: React.FC = () => {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
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

  return (
    <Card sx={styles.card}>
      <Typography variant="h5" gutterBottom>
        Совет дня
      </Typography>
      {advice ? (
        <Typography sx={styles.adviceText}>{advice.text}</Typography>
      ) : (
        <Typography sx={styles.adviceText}>Нажмите кнопку, чтобы получить совет</Typography>
      )}
      <Button variant="contained" onClick={handleGetAdvice} disabled={loading} sx={styles.button}>
        {loading ? 'Загрузка...' : 'Получить совет'}
      </Button>
    </Card>
  );
};
